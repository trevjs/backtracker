define(
  ['jquery','underscore', 'backbone', 'marionette', 'jqui'],
  function() {
    //Primary view/controller
    mainView = Backbone.Marionette.Layout.extend({
      el : '#output',
      template : '#main',
      regions : {
        leftColumn :  '#left-column',
        rightColumn : '#right-column',
        dialogForm : '#dialog-container'
      },
      initialize : function(){
        //Listen to the projects collection, and re-render on changes.
        this.listenTo(App.projects, 'all', this.render);
      },
      onRender : function(){
        var projects = new projectPaneLayout();     

        this.leftColumn.currentView = projects;
        this.leftColumn.show(projects);
        
        //Only display the task pane if there is an active project
        if (App.projects.currentActiveProject) {
          var tasks = new taskPaneLayout();
          
          this.rightColumn.currentView = tasks;
          this.rightColumn.show(tasks); 
        }
      },
      newProjectForm : function(){
        var form = new projectForm;        
        this.dialogForm.show(form);
      },
      newTaskForm : function(){
        var form = new taskForm;
        this.dialogForm.show(form);
      }
    });
    
    //Requires a header_id and body_id to be passed in on init
    paneLayout = Backbone.Marionette.Layout.extend({
      template : '#pane',
      initialize : function (){
        this.header_id =  this.id_root + '-header';
        this.body_id = this.id_root + '-body';
        this.addRegion('header', '#' + this.header_id);
        this.addRegion('body', '#' + this.body_id);
      },
      //provide data to the template
      serializeData : function (){
        return {
          'header_id' : this.header_id,
          'body_id' : this.body_id,
        }
      }
    });
    
    //Requires a header_id and body_id to be passed in on init
    projectPaneLayout = paneLayout.extend({
      el : '#left-column',
      id_root : 'projects',
      onRender : function (){
        this.$el.addClass('pane');
        var header = new projectPaneHeader({el : '#'+this.header_id});
        header.title = 'Projects';
        header.button_text = 'New Project';
        
        this.header.currentView = header;
        this.header.show(header);
        
        body = new paneBody({
          collection : App.projects,
          el : '#' + this.body_id,
          itemView : projectItemView,
        });        
        
        this.body.currentView = body;
        this.body.show(body);
      }
    });
    
    //Requires a header_id and body_id to be passed in on init
    taskPaneLayout = paneLayout.extend({
      el : '#right-column',
      id_root : 'tasks',
      onRender : function(){
        this.$el.addClass('pane');
        var tasksHeader = new taskPaneHeader({el : '#' + this.header_id});
        tasksHeader.title = 'Tasks for project ' + App.projects.currentActiveProject.get('title');
        tasksHeader.button_text = 'New Tasks';
          
        this.header.currentView = tasksHeader;
        this.header.show(tasksHeader);
          
        tasksBody = new paneBody({
          collection : App.projects.currentActiveProject.tasks,
          el : '#' + this.body_id,
          itemView : taskItemView,
        });
          
        this.body.currentView = tasksBody;
        this.body.show(tasksBody);
      }
    });
    
    //Requires a title and button_text property to be passed in on init
    paneHeader =  Backbone.Marionette.ItemView.extend({
      template : '#pane-header',      
      
      //provide data to the template
      serializeData : function(){
        return {
          'title' : this.title,
          'button_text' : this.button_text
        }
      }
    });
    
    projectPaneHeader = paneHeader.extend({
      events : {
        'click button' : 'newProjectForm'
      },
      //Display the project form
      newProjectForm : function(){
        App.mainView.newProjectForm();
      }
    });
    
    taskPaneHeader = paneHeader.extend({
      events : {
        'click button' : 'newTaskForm'
      },
      //Display the task form
      newTaskForm : function(){
        App.mainView.newTaskForm();
      }
    })
    
    listItemView = Backbone.Marionette.ItemView.extend({
      template : '#item',
      onRender : function (){
        this.addClasses();
      },
      //Add jQuery UI Classes
      addClasses : function (){
        this.$el.addClass('item ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
      }
    });
    
    projectItemView = listItemView.extend({
      events : {
        'click button.ui-icon-folder-open' : 'openProject',
        'click button.ui-icon-folder-collapsed' : 'closeProject',
      },
      //Render a project/task.  If it is the active project leave it open, else close it.
      onRender : function (){
        this.addClasses();
        if (this.model.get('active') == false) {
          this.setProjectClosed();
        }
      },
      //Open a project and make it active
      openProject : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');
        this.$el.find('.item-body').show();
        App.projects.newActiveProject(this.model);
        
      },
      //Close a project, and deactivate it
      closeProject : function (){
        App.projects.unsetActiveProject(this.model);
        this.setProjectClosed();
        
      },
      //Close a project, but don't deactivate it (see onRender)
      setProjectClosed : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
        this.$el.find('.item-body').hide();
      }
    });
    
    taskItemView = listItemView.extend({
            events : {
        'click button.ui-icon-folder-open' : 'openTask',
        'click button.ui-icon-folder-collapsed' : 'closeTask',
      },
      //If it is the active project leave it open, else close it.
      onRender : function (){
        this.addClasses();
        if (this.model.get('open') == false) {
          this.setTaskClosed();          
        }
      },
      //Open a project and make it active
      openTask : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');
        this.$el.find('.item-body').show();        
        this.model.set('open', true);
      },
      //Close a project, and deactivate it
      closeTask : function (){
        this.setProjectClosed();        
      },
      //Close a project, but don't deactivate it (see onRender)
      setProjectClosed : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
        this.$el.find('.item-body').hide();
        this.model.set('open', false);
      }
    });
    
    paneBody = Backbone.Marionette.CollectionView.extend({
      template : '#pane-body',
      el : '.pane-body',
      initialize : function (){
        //this.listenTo(this.collection, 'all', App.mainView.render);
      }
    });
    
    dialogForm = Backbone.Marionette.ItemView.extend({
      el : '#dialog-container',
      events : {
        'click button' : 'saveItem',
      },
      onRender : function(){
        var view = App.mainView.dialogForm;
        var title = this.title();
        //Jquery UI dialog
        $(view.el).dialog({
          modal : true,
          title : title,
          draggable : false,
          width : 400,
          buttons : {
            'Save' : function(){view.currentView.saveItem()},
            'Cancel' : function(){view.currentView.close()},
          }
          //@todo: pressing enter submits the form
        });
      },
      saveItem : function(){
        //define this in the child class
      },
      close : function(){
        //close the dialog
        $(this.el).dialog('close');
        //clear the form
        $(this.el).empty();
      }
    });
    
    projectForm = dialogForm.extend({
      title : function(){
        if (this.model) {
          return this.model.get('title');
        }
        return 'New project';
      },
      template : '#project-form',
      saveItem : function (){
        var view = App.mainView.dialogForm;
        
        //retrieve the contents of the form items
        //@todo: move this to a utility function or form parent class
        var formData = {};
        $(view.el + ' form').find('input').each( function( i, el ) {
          if( $( el ).val() != '' ){
              formData[ el.name ] = $( el ).val();
          }
        });
        
        //validate
        //@TODO
        var valid = true;
        
        //save
        if (valid) {
          //inputs are valid, save the object  
          App.projects.add(new project(formData));
          
          //close the dialog
          this.close();
          //clear the form
          this.$el.empty(); 
        }else{
          //@todo: display validation errors
        }
      }
    });
    
    taskForm = dialogForm.extend({
      title : function(){
        if (this.model) {
          return this.model.get('title');
        }
        return 'New task'
      },
      template : '#task-form',
      saveItem : function (){
        var view = App.mainView.dialogForm;
        
        //retrieve the contents of the form items
        //@todo: move this to a utility function or form parent class
        var formData = {};
        $(view.el + ' form').find('input').each( function( i, el ) {
          if( $( el ).val() != '' ){
              formData[ el.name ] = $( el ).val();
          }
        });
        
        //validate
        //@TODO
        var valid = true;
        
        //save
        if (valid) {
          //inputs are valid, save the object  
          App.projects.currentActiveProject.tasks.add(new task(formData));
          
          //close the dialog
          view.close();
          //clear the form
          view.$el.empty(); 
        }else{
          //@todo: display validation errors
        }
      }
    });
  });