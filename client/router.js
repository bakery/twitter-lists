Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('landing', {
    path: '/',
    action : function(){
      Router.go('/' + Meteor.uuid());
    }
  });

  this.route('dashboard', {
    path: '/:_sessionId',
    controller : 'DashboardController'
  });
});