App.PeriodController = Ember.ObjectController.extend( Ember.Evented, App.HelpText, {
  needs: ['artwork'],
  
  
  actions: {
    updateRecord: function(val) {
      this.model.set('updated',true);
      this.send("rebuildStructure");
    },
    updateProvenance: function(val) {
      this.model.rollback();
      var self = this;
      var id = this.model.get('id');
      Ember.$.post('/parsers/provenance_line', {str: val})
        .then(function(data){
          // Normalize the data
          var p = self.store.normalize('period',data.period[0])
          p.id = id
          // Save fields that you want to update
          var orig = self.model.get('original_text');
          var dt = self.model.get('direct_transfer');
          var foot = self.model.get('footnote');
          var order = self.model.get('order');

          self.store.push('period',p);

          // Re-load fields that you want to update
          self.model.set('original_text',orig);
          self.model.set('direct_transfer',dt);
          self.model.set('footnote',foot);
          self.model.set('order',order);
          self.model.set('updated', true);

          self.send('rebuildStructure');
        });     
    },
    updateDate: function(val) {
      var self = this;
      this.model.rollback();
      Ember.$.post('/parsers/timestring', {str: val})
        .then(function(data){
          self.model.set('botb',jd_to_cal(data.botb))
          self.model.set('eotb',jd_to_cal(data.eotb))
          self.model.set('botb_precision',data.botb_precision)
          self.model.set('eotb_precision',data.eotb_precision)
          self.model.set('bote',jd_to_cal(data.bote))
          self.model.set('eote',jd_to_cal(data.eote)) 
          self.model.set('bote_precision',data.bote_precision)
          self.model.set('eote_precision',data.eote_precision)     
          self.model.set('updated',true);     
          self.send('rebuildStructure');
        });
    },
  },
  
  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended"),
});