Template.feed.helpers({
  activities: function() {
    //return Activities.find({}, {sort: {date: 1}});
    return Activities.find({}, {sort: {date: 1}, limit: 5});
  },
  ready: function() {
    return Router.current().feedSubscription.ready();
  }
});

Template.feed2.helpers({
  activities: function() {
    //return Activities.find({}, {sort: {date: 1}});
    return Activities.find({}, {sort: {date: -1}, limit: 10});
  },
  ready: function() {
    //return Router.current().feedSubscription.ready();
    return Router.current().feedSubscription.ready();
  }
});