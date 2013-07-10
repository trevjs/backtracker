define(
  ['jquery', 'underscore', 'backbone'],
  function(){  
  task = Backbone.Model.extend({

    // Default attributes for the task.
    defaults: function() {
      return {
        title: "new task",
        description: '',
        order: App.projects.nextOrder(),
        done: false
      };
    },

    // Ensure that each task created has `title`.
    initialize: function() {
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
      if (!this.get("description")) {
        this.set({"description": this.defaults().description});
      }
    },
  });
});