const router =
  require("express").Router();

const ctrl =
  require("../controllers/bugController");

const auth =
  require("../middleware/authMiddleware");

/*
========================================
CREATE BUG
========================================
*/

router.post(
  "/",
  auth,
  ctrl.createBug
);

/*
========================================
GET ALL BUGS
========================================
*/

router.get(
  "/",
  ctrl.getBugs
);

/*
========================================
MY DASHBOARD
========================================
*/

router.get(
  "/dashboard/me",
  auth,
  ctrl.getMyDashboard
);

/*
========================================
GET USERS
========================================
*/

router.get(
  "/users/all",
  auth,
  ctrl.getAllUsers
);

/*
========================================
ANALYTICS DASHBOARD
========================================
*/

router.get(
  "/analytics/dashboard",
  auth,
  ctrl.getAnalytics
);

/*
========================================
PUBLIC BUG
========================================
*/

router.get(
  "/:id/public",
  ctrl.getPublicBug
);

/*
========================================
GET SINGLE BUG
========================================
*/

router.get(
  "/:id",
  ctrl.getBugById
);

/*
========================================
UPDATE BUG
========================================
*/

router.put(
  "/:id",
  auth,
  ctrl.updateBug
);

/*
========================================
ASSIGN BUG
========================================
*/

router.patch(
  "/:id/assign",
  auth,
  ctrl.assignBug
);

/*
========================================
UPDATE STATUS
========================================
*/

router.patch(
  "/:id/status",
  auth,
  ctrl.updateBugStatus
);

/*
========================================
UPDATE PRIORITY
========================================
*/

router.patch(
  "/:id/priority",
  auth,
  ctrl.updateBugPriority
);

/*
========================================
DELETE BUG
========================================
*/

router.delete(
  "/:id",
  auth,
  ctrl.deleteBug
);

module.exports = router;