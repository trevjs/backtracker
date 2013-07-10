define(
  ['jquery', 'underscore', 'backbone'],
  function(){
  project = Backbone.Model.extend({

    // Default attributes for the project
    defaults: function() {
      return {
        title: "new project",
        description: '',
        order: App.projects.nextOrder(),
        done: false
        //@todo: created date, category, etc
      };
    },
    
    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
      if (!this.get("description")) {
        this.set({"description": this.defaults().description});
      }
      
      //initialize the task list collection
      this.tasks = new taskList;
      
      //Set the newly creative project to active
      App.projects.newActiveProject(this);
    },

  });
});