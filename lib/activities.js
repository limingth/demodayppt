Activities = new Mongo.Collection('activities');

Activities.allow({
  insert: function(userId, doc) {
    return doc.userId === userId;
  }
});

Activities.latest = function() {
  return Activities.find({}, {sort: {date: 1}, limit: 3});
}

Meteor.methods({
  createActivity: function(activity, tweet, loc) {
    check(Meteor.userId(), String);
    check(activity, {
      recipeName: String,
      text: String,
      image: String
    });
    check(tweet, Boolean);
    check(loc, Match.OneOf(Object, null));
    
    activity.userId = Meteor.userId();
    activity.userAvatar = Meteor.user().services.twitter.profile_image_url_https;
    activity.userName = Meteor.user().profile.name;
    activity.date = new Date;
    
    if (! this.isSimulation && loc)
      activity.place = getLocationPlace(loc);
    
    var id = Activities.insert(activity);
    
    if (! this.isSimulation && tweet)
      tweetActivity(activity);
    
    return id;
  }
});

if (Meteor.isServer) {
  var twitterOauth = function(options) {
    var config = Meteor.settings.twitter
    var userConfig = Meteor.user().services.twitter;

    return {
      consumer_key: config.consumerKey,
      consumer_secret: config.secret,
      token: userConfig.accessToken,
      token_secret: userConfig.accessTokenSecret
    };
  }
  
  var tweetActivity = function(activity) {
    // creates the tweet text, optionally truncating to fit the appended text
    function appendTweet(text, append) {
      var MAX = 117; // Max size of tweet with image attached
      
      if ((text + append).length > MAX)
        return text.substring(0, (MAX - append.length - 3)) + '...' + append;
      else
        return text + append;
    }
    
    // we need to strip the "data:image/jpeg;base64," bit off the data url
    var image = activity.image.replace(/^data.*base64,/, '');

    var response = HTTP.post(
      'https://upload.twitter.com/1.1/media/upload.json', {
        params: { media: image },
        npmRequestOptions: { oauth: twitterOauth() }
      }
    );
    
    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to post image to twitter');

    if (! response.data)
      throw new Meteor.Error(500, 'Did not receive attachment from twitter');

    var attachment = response.data;

    response = HTTP.post(
      'https://api.twitter.com/1.1/statuses/update.json', {
        params: {
          status: appendTweet(activity.text, ' #localmarket'),
          media_ids: attachment.media_id_string
        },
        npmRequestOptions: { oauth: twitterOauth() }
      }
    );

    if (response.statusCode !== 200)
      throw new Meteor.Error(500, 'Unable to create tweet');
  }
  
  var getLocationPlace = function(loc) {
    var url = 'https://api.twitter.com/1.1/geo/reverse_geocode.json'
      + '?granularity=neighborhood'
      + '&max_results=1'
      + '&accuracy=' + loc.coords.accuracy
      + '&lat=' + loc.coords.latitude
      + '&long=' + loc.coords.longitude;
    
    var response = HTTP.get(url,
                            {npmRequestOptions: { oauth: twitterOauth() } });

    if (response.statusCode === 200 && response.data) {
      var place = _.find(response.data.result.places, function(place) {
        return place.place_type === 'neighborhood';
      });
      
      return place && place.full_name;
    }
  }
}

// Initialize a seed activity
Meteor.startup(function() {
  if (Meteor.isServer && Activities.find().count() >= 0) {
    Activities.remove({});
    Activities.insert({
      type: "invested",
      recipeName: 'invested-1',
      text: '有数致力于打造属于高中生的数学MOOC平台',
      image: '/img/activity/vobile/',
      userAvatar: '/img/vobile-logo.jpg',
      userName: '有数学院',
      place: 'San Francisco',
      date: new Date,
      slides: 22
    });
    Activities.insert({
      type: "invested",
      recipeName: 'invested-2',
      text: '面向婴幼儿教育的一款app',
      image: '/img/activity/graphsql/',
      userAvatar: '/img/GraphSQL-logo.png',
      userName: '宝育',
      place: 'San Francisco',
      date: new Date,
      slides: 21
    });


    Activities.insert({
      type: "investing",
      recipeName: 'investing-2',
      text: '企业销售管理系统移动端',
      image: '/img/activity/tobeupload/',
      userAvatar: '/img/project1.jpg',
      userName: '企业内部app',
      place: 'San Francisco',
      date: new Date,
      slides: 1
    });
    Activities.insert({
      type: "investing",
      recipeName: 'investing-1',
      text: '“童年”一款帮助父母通过文字、图片、语音、微视频等形式帮助父母记录孩子成长历程的APP.',
      image: '/img/activity/tobeupload/',
      userAvatar: '/img/project1.jpg',
      userName: '童年',
      place: 'San Francisco',
      date: new Date,
      slides: 1
    });

}
});

