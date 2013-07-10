//Configurations for require.js
require.config(
  {
    baseUrl: '/backtracker/scripts',
    paths: {
      'underscore' : 'lib/underscore',
      'backbone' : 'lib/backbone',
      'marionette' : 'lib/backbone.marionette',
      'jqui' : 'lib/jquery-ui/development-bundle/ui/jquery-ui.custom',
      'jquery' : 'lib/jquery-2.0.3',
      'backbone.localStorage' : 'lib/backbone.localStorage',
      'handlebars' : 'lib/handlebars'
    },
    shim: {
      'backbone' : {
        exports : 'Backbone',
        deps : ['jquery', 'underscore']
        
      },
      'underscore' : {
        exports : '_'
      },
      'marionette' : {
        deps : ['jquery', 'underscore', 'backbone'],
        exports : 'Marionette'
      }
    }
  }
)

var App = App || {};

//Define the Application
require(
  ['marionette', 'views/mainView', 'handlebars', 'models/project','collections/projectList', 'models/task', 'collections/taskList'],
  function(){
    //Over-ride underscore templating to use handlebars instead.
    Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
        return Handlebars.compile(rawTemplate);
    };
    App.projects = new projectList;
    
    App.mainView = new mainView;
    App.mainView.render();
});