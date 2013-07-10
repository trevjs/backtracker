
define(
   ['jquery', 'underscore', 'backbone', 'backbone.localStorage'],
   function(){   
   projectList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: project,

   newActiveProject : function(model){
      if (this.currentActiveProject) {
         this.currentActiveProject.set({'active' : false});
      }
      
      model.set({'active' : true});
      
      //set a pointer to the active project to make it easier to unset later
      this.currentActiveProject = model;
      
      this.trigger('projects:new-active');
   },
   unsetActiveProject : function(){
      if (this.currentActiveProject) {
          this.currentActiveProject.set({'active' : false});
         this.currentActiveProject = null;
      }
      this.trigger('projects:unset-active');
   },
   
   /**
    * @todo: the following methods are yet to be tested/implemented
    */
   
    // Filter down the list of all projects that are finished.
    done: function() {
      return this.filter(function(project){ return project.get('done'); });
    },

    // Filter down the list to projects that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Projects are sorted by their original insertion order.
    comparator: function(project) {
      return project.get('order');
    }

  });

});