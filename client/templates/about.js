var FEATURED_COUNT = 4;

Template.about.helpers({
  // selects FEATURED_COUNT number of recipes at random
  
  events: function() {
    var events = [];
    events.push({title: "JayWSalon Entrepreneurship Series I", content: "Should I quit to startup NOW", place: "InnoSpring", date: "2015-03-26 19:00"});
    events.push({title: "Startup & Tech Mixer", content: "How many do you really know", place: "San Francisco", date: "2015-03-27 17:00"});
    events.push({title: "HYSTA@Wechat", content: "How to build a product like wechat open platform", place: "GSB@stanford", date: "2015-03-28 16:00"});
    events.push({title: "The Startup Conferrence 2015", content: "the largest tech startup Conferrence", place: "Redwood City", date: "2015-05-14 09:00"});
    return events;
  },

});