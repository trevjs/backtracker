
define(
  ['jquery', 'underscore', 'backbone', 'backbone.localStorage'],
  function(){   
    taskList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: task,

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(task){ return task.get('done'); });
    },

    // Filter down the list to only tasks that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },
    
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Tasks are sorted by their original insertion order.
    comparator: function(task) {
      return task.get('order');
    }

  });

});