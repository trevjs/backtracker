define(
  ['collections/projectList'],
  function () {
    projectListView = Backbone.Marionette.CompositeView.extend({
      itemView : projectItemView,
      template : '#tasks-pane',
      itemViewContainer : '#pane-body',
    });
  }
)