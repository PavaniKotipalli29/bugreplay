const db = require("../models/db");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification");

/*
========================================
COMMON BUG QUERY
========================================
*/

const bugSelectQuery = `
SELECT
  bugs.*,
  users.name AS creator_name,
  assigned_user.name AS assigned_to_name,
  projects.name AS project_name

FROM bugs

JOIN users
ON bugs.user_id = users.id

LEFT JOIN users AS assigned_user
ON bugs.assigned_to = assigned_user.id

LEFT JOIN projects
ON bugs.project_id = projects.id
`;

/*
========================================
CREATE BUG
========================================
*/

exports.createBug = (req, res) => {

  const {
    title,
    description,
    expected_result,
    actual_result,
    severity,
    project_id,
    tags
  } = req.body;

  db.query(
    `
    INSERT INTO bugs
    (
      user_id,
      title,
      description,
      expected_result,
      actual_result,
      severity,
      project_id,
      tags
    )
    VALUES (?,?,?,?,?,?,?,?)
    `,
    [
      req.user.id,
      title,
      description,
      expected_result || null,
      actual_result || null,
      severity || "Low",
      project_id ? parseInt(project_id) : null,
      tags || ""
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      logActivity(
        result.insertId,
        req.user.id,
        "Created bug"
      );

      res.json({
        msg: "Bug created"
      });

    }
  );

};

/*
========================================
GET ALL BUGS
========================================
*/

exports.getBugs = (req, res) => {

  const {
    search,
    status,
    severity,
    project_id,
    tag,
    sortBy
  } = req.query;

  const page =
    parseInt(req.query.page) || 1;

  const limit = 5;

  const offset =
    (page - 1) * limit;

  let whereQuery = "WHERE 1=1";

  let values = [];

  if (search) {
    whereQuery +=
      " AND bugs.title LIKE ?";

    values.push(`%${search}%`);
  }

  if (status) {
    whereQuery +=
      " AND bugs.status=?";

    values.push(status);
  }

  if (severity) {
    whereQuery +=
      " AND bugs.severity=?";

    values.push(severity);
  }

  if (project_id) {
    whereQuery +=
      " AND bugs.project_id=?";

    values.push(parseInt(project_id));
  }

  if (tag) {
    whereQuery +=
      " AND bugs.tags LIKE ?";

    values.push(`%${tag}%`);
  }

  // Sort Query
  let sortSql = "ORDER BY bugs.updated_at DESC";
  if (sortBy === "newest") {
    sortSql = "ORDER BY bugs.created_at DESC";
  } else if (sortBy === "priority") {
    sortSql = `ORDER BY 
      CASE bugs.priority 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
        ELSE 5 
      END ASC, bugs.updated_at DESC`;
  } else if (sortBy === "severity") {
    sortSql = `ORDER BY 
      CASE bugs.severity 
        WHEN 'High' THEN 1 
        WHEN 'Medium' THEN 2 
        WHEN 'Low' THEN 3 
        ELSE 4 
      END ASC, bugs.updated_at DESC`;
  }

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM bugs
    ${whereQuery}
  `;

  db.query(
    countQuery,
    values,
    (err, countResult) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      const total =
        countResult[0].total;

      const query = `
        ${bugSelectQuery}

        ${whereQuery}

        ${sortSql}

        LIMIT ? OFFSET ?
      `;

      db.query(
        query,
        [
          ...values,
          limit,
          offset
        ],
        (err2, result) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          res.json({
            bugs: result,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBugs: total
          });

        }
      );

    }
  );

};

/*
========================================
GET SINGLE BUG
========================================
*/

exports.getBugById = (req, res) => {

  const bugId = req.params.id;

  db.query(
    `
    ${bugSelectQuery}

    WHERE bugs.id=?
    `,
    [bugId],

    (err, bugResult) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (bugResult.length === 0) {
        return res.status(404).json({
          msg: "Bug not found"
        });
      }

      db.query(
        `
        SELECT *
        FROM steps
        WHERE bug_id=?
        ORDER BY step_number ASC
        `,
        [bugId],

        (err2, stepsResult) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          db.query(
            `
            SELECT *
            FROM screenshots
            WHERE bug_id=?
            `,
            [bugId],

            (err3, screenshotResult) => {

              if (err3) {
                console.log(err3);
                return res.status(500).json(err3);
              }

              res.json({
                bug: bugResult[0],
                steps: stepsResult,
                screenshots: screenshotResult
              });

            }
          );

        }
      );

    }
  );

};

/*
========================================
UPDATE BUG
========================================
*/

exports.updateBug = (req, res) => {

  const {
    title,
    description,
    expected_result,
    actual_result,
    status,
    severity,
    project_id,
    tags
  } = req.body;

  db.query(
    `
    SELECT *
    FROM bugs
    WHERE id=?
    `,
    [req.params.id],

    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          msg: "Bug not found"
        });
      }

      const bug = result[0];

      const isOwner =
        bug.user_id === req.user.id;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          msg: "Unauthorized"
        });
      }

      db.query(
        `
        UPDATE bugs
        SET
          title=?,
          description=?,
          expected_result=?,
          actual_result=?,
          status=?,
          severity=?,
          project_id=?,
          tags=?
        WHERE id=?
        `,
        [
          title,
          description,
          expected_result,
          actual_result,
          status,
          severity,
          project_id ? parseInt(project_id) : null,
          tags || "",
          req.params.id
        ],

        (err2) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          logActivity(
            req.params.id,
            req.user.id,
            "Updated bug"
          );

          res.json({
            msg: "Bug updated"
          });

        }
      );

    }
  );

};

/*
========================================
DELETE BUG
========================================
*/

exports.deleteBug = (req, res) => {

  db.query(
    `
    SELECT *
    FROM bugs
    WHERE id=?
    `,
    [req.params.id],

    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          msg: "Bug not found"
        });
      }

      const bug = result[0];

      const isOwner =
        bug.user_id === req.user.id;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          msg: "Unauthorized"
        });
      }

      logActivity(
        req.params.id,
        req.user.id,
        "Deleted bug"
      );

      db.query(
        `
        DELETE FROM bugs
        WHERE id=?
        `,
        [req.params.id],

        (err2) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          res.json({
            msg: "Bug deleted"
          });

        }
      );

    }
  );

};

/*
========================================
ASSIGN BUG
========================================
*/

exports.assignBug = (req, res) => {

  const bugId = req.params.id;

  const {
    assigned_to
  } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({
      msg: "Only admin can assign bugs"
    });
  }

  // Get bug title before assigning
  db.query("SELECT title FROM bugs WHERE id = ?", [bugId], (err, bugRes) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    const bugTitle = bugRes.length > 0 ? bugRes[0].title : "Unknown Bug";

    db.query(
      `
      UPDATE bugs
      SET assigned_to=?
      WHERE id=?
      `,
      [
        assigned_to || null,
        bugId
      ],

      (err2) => {

        if (err2) {
          console.log(err2);
          return res.status(500).json(err2);
        }

        logActivity(
          bugId,
          req.user.id,
          `Assigned bug to user ID ${assigned_to}`
        );

        if (assigned_to) {
          createNotification(
            parseInt(assigned_to),
            "assignment",
            `You have been assigned to bug: "${bugTitle}" by Admin`
          );
        }

        res.json({
          msg: "Bug assigned successfully"
        });

      }
    );
  });

};

/*
========================================
UPDATE STATUS
========================================
*/

exports.updateBugStatus = (req, res) => {

  const bugId = req.params.id;

  const { status } = req.body;

  db.query("SELECT title, user_id, assigned_to FROM bugs WHERE id = ?", [bugId], (err, bugRes) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (bugRes.length === 0) {
      return res.status(404).json({ msg: "Bug not found" });
    }
    const bug = bugRes[0];

    db.query(
      `
      UPDATE bugs
      SET status=?
      WHERE id=?
      `,
      [
        status,
        bugId
      ],

      (err2) => {

        if (err2) {
          console.log(err2);
          return res.status(500).json(err2);
        }

        logActivity(
          bugId,
          req.user.id,
          `Status changed to ${status}`
        );

        const msg = `Bug "${bug.title}" status was updated to "${status}" by ${req.user.name || 'User'}`;
        if (bug.user_id !== req.user.id) {
          createNotification(bug.user_id, "status", msg);
        }
        if (bug.assigned_to && bug.assigned_to !== req.user.id && bug.assigned_to !== bug.user_id) {
          createNotification(bug.assigned_to, "status", msg);
        }

        res.json({
          msg: "Status updated"
        });

      }
    );
  });

};

/*
========================================
UPDATE PRIORITY
========================================
*/

exports.updateBugPriority = (req, res) => {

  const bugId = req.params.id;

  const { priority } = req.body;

  db.query("SELECT title, user_id, assigned_to FROM bugs WHERE id = ?", [bugId], (err, bugRes) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (bugRes.length === 0) {
      return res.status(404).json({ msg: "Bug not found" });
    }
    const bug = bugRes[0];

    db.query(
      `
      UPDATE bugs
      SET priority=?
      WHERE id=?
      `,
      [
        priority,
        bugId
      ],

      (err2) => {

        if (err2) {
          console.log(err2);
          return res.status(500).json(err2);
        }

        logActivity(
          bugId,
          req.user.id,
          `Priority changed to ${priority}`
        );

        const msg = `Bug "${bug.title}" priority was updated to "${priority}" by ${req.user.name || 'User'}`;
        if (bug.user_id !== req.user.id) {
          createNotification(bug.user_id, "priority", msg);
        }
        if (bug.assigned_to && bug.assigned_to !== req.user.id && bug.assigned_to !== bug.user_id) {
          createNotification(bug.assigned_to, "priority", msg);
        }

        res.json({
          msg: "Priority updated"
        });

      }
    );
  });

};

/*
========================================
GET ALL USERS
========================================
*/

exports.getAllUsers = (req, res) => {

  db.query(
    `
    SELECT
      id,
      name,
      email,
      role
    FROM users
    ORDER BY name ASC
    `,

    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

/*
========================================
MY DASHBOARD
========================================
*/

exports.getMyDashboard = (req, res) => {

  const userId = req.user.id;

  db.query(
    `
    ${bugSelectQuery}

    WHERE bugs.assigned_to=?

    ORDER BY bugs.updated_at DESC
    `,
    [userId],

    (err, assigned) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      db.query(
        `
        ${bugSelectQuery}

        WHERE bugs.user_id=?

        ORDER BY bugs.updated_at DESC
        `,
        [userId],

        (err2, reported) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          db.query(
            `
            ${bugSelectQuery}

            ORDER BY bugs.updated_at DESC

            LIMIT 10
            `,

            (err3, recent) => {

              if (err3) {
                console.log(err3);
                return res.status(500).json(err3);
              }

              res.json({
                assigned,
                reported,
                recent
              });

            }
          );

        }
      );

    }
  );

};

/*
========================================
PUBLIC BUG
========================================
*/

exports.getPublicBug = (req, res) => {

  const bugId = req.params.id;

  db.query(
    `
    ${bugSelectQuery}

    WHERE bugs.id=?
    `,
    [bugId],

    (err, bugResult) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (bugResult.length === 0) {
        return res.status(404).json({
          msg: "Bug not found"
        });
      }

      db.query(
        `
        SELECT *
        FROM steps
        WHERE bug_id=?
        ORDER BY step_number ASC
        `,
        [bugId],

        (err2, stepsResult) => {

          if (err2) {
            console.log(err2);
            return res.status(500).json(err2);
          }

          db.query(
            `
            SELECT *
            FROM screenshots
            WHERE bug_id=?
            `,
            [bugId],

            (err3, screenshotResult) => {

              if (err3) {
                console.log(err3);
                return res.status(500).json(err3);
              }

              res.json({
                bug: bugResult[0],
                steps: stepsResult,
                screenshots: screenshotResult
              });

            }
          );

        }
      );

    }
  );

};

// ANALYTICS DASHBOARD
exports.getAnalytics = (req, res) => {
  const queries = {
    totalBugs:
      "SELECT COUNT(*) AS total FROM bugs",

    openBugs:
      "SELECT COUNT(*) AS total FROM bugs WHERE status='Open'",

    progressBugs:
      "SELECT COUNT(*) AS total FROM bugs WHERE status='In Progress'",

    resolvedBugs:
      "SELECT COUNT(*) AS total FROM bugs WHERE status='Resolved'",

    highSeverity:
      "SELECT COUNT(*) AS total FROM bugs WHERE severity='High'",

    mediumSeverity:
      "SELECT COUNT(*) AS total FROM bugs WHERE severity='Medium'",

    lowSeverity:
      "SELECT COUNT(*) AS total FROM bugs WHERE severity='Low'"
  };

  const results = {};

  const keys = Object.keys(queries);

  let completed = 0;

  keys.forEach((key) => {
    db.query(queries[key], (err, result) => {
      if (err) return res.status(500).json(err);

      results[key] = result[0].total;

      completed++;

      if (completed === keys.length) {
        res.json(results);
      }
    });
  });
};