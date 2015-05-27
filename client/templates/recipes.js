Template.recipes.helpers({
  activities: function() {
    //return Activities.find({}, {sort: {date: 1}});
    return Activities.find({recipeName: "investing"}, {sort: {date: 1}});
  },
  ready: function() {
    return Router.current().feedSubscription.ready();
  }
});