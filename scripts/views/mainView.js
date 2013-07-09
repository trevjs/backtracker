define(
  ['jquery','underscore', 'backbone', 'marionette', 'jqui'],
  function() {
    mainView = Backbone.Marionette.Layout.extend({
      el : '#output',
      template : '#main',
      regions : {
        leftColumn :  '#left-column',
        rightColumn : '#right-column',
        dialogForm : '#dialog-container'
      },
      onRender : function(){
        var projects = new paneLayout;     
        
        this.leftColumn.show(projects);      
        
        var header = new projectPaneHeader;
        header.title = 'Projects';
        header.button_text = 'New Project';
        
        projects.header.currentView = header;
        projects.header.show(header);
        
        body = new paneBody({
          collection : App.projects,  
        });        
        
        projects.body.currentView = body;
        projects.body.show(body);
        console.log('Rendered main view.');
      },
      newProjectForm : function(){
        var form = new projectForm;        
        this.dialogForm.show(form);
      }
    });

    paneLayout = Backbone.Marionette.Layout.extend({
      template : '#pane',
      regions: {
        header : '.pane-header',
        body : '.pane-body'
      },
      onRender : function (){
        this.$el.addClass('pane');
      }
    });

    paneHeader =  Backbone.Marionette.ItemView.extend({
      template : '#pane-header',
      el : '.pane-header',
      
      //provide data to the template
      serializeData : function(){
        //@todo: throw an error if either of these aren't set
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
      newProjectForm : function(){
        App.mainView.newProjectForm();
      }
    });    
    
    listItemView = Backbone.Marionette.ItemView.extend({
      template : '#item',
      onRender : function (){
        this.addClasses();
      },
      addClasses : function (){
        this.$el.addClass('item ui-widget ui-widget-content ui-helper-clearfix ui-corner-all')
      }
    });
    
    projectItemView = listItemView.extend({      
      events : {
        'click button.ui-icon-folder-open' : 'openProject',
        'click button.ui-icon-folder-collapsed' : 'closeProject',
      },
      onRender : function (){
        this.addClasses();
        if (this.model.get('active') == false) {
          this.setProjectClosed();
          console.log('project closed');
        }
      },
      openProject : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-open').addClass('ui-icon-folder-collapsed');
        this.$el.find('.item-body').show();
        App.projects.newActiveProject(this.model);
      },
      closeProject : function (){
        App.projects.unsetActiveProject(this.model);
        this.setProjectClosed();
      },
      setProjectClosed : function (){
        this.$el.find('.item-header button.ui-icon').removeClass('ui-icon-folder-collapsed').addClass('ui-icon-folder-open');
        this.$el.find('.item-body').hide();
      }
    });
    
    paneBody = Backbone.Marionette.CollectionView.extend({
      template : '#pane-body',
      itemView : projectItemView,
      el : '.pane-body',
      onRender : function (){
        console.log('rendered pane body');
      },
      initialize : function (){
        this.listenTo(this.collection, 'change', this.render);
      }
    });
    
    dialogForm = Backbone.Marionette.ItemView.extend({
      el : '#dialog-container',
      events : {
        'click button' : 'saveItem',
      },
      onRender : function(){
        var view = App.mainView.dialogForm;
        $(view.el).dialog({
          modal : true,
          draggable : false,
          width : 400,
          buttons : {
            'Save' : function(){view.currentView.saveItem()},
            'Cancel' : function(){view.currentView.close()},
          }
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
      template : '#project-form',
      saveItem : function (){
        var view = App.mainView.dialogForm;
        
        //retrieve the contents of the form items
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
          view.close();
          //clear the form
          view.$el.empty(); 
        }else{
          //@todo: display validation errors
        }
      }
    });
  });