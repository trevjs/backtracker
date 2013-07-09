define(
  ['collections/projectList'],
  function () {
    projectListView = Backbone.Marionette.CompositeView.extend({
      itemView : projectView,
      template : '#projects-pane',
      itemViewContainer : '#pane-body',
      events : {
        'click button' : 'newProject'
      },
      //Handler for the new project button
      newProject: function(e) {
        var projectForm = new app.projectEditView();
        projectForm.render();
      },
      templateData: {
        paneId: 'project-list-view',
        paneTitle : 'Projects',
        buttonText : 'New Project',
        buttonId : 'new-project'
      },
    });
  }
)