App.PeriodController = Ember.ObjectController.extend( Ember.Evented, {
  needs: ['artwork'],

  name_help: {
    text:  "<p>This is the name of the person, institution, marriage, or gallery involved during this period.</p><p>Abbreviations and clauses in the name need to be on a white list: <i>Dr. Marvin Gaye</i>, or <i>James Dean, his son</i> will work, but others may not.</p><p>Avoid using parentheses in the name.</p>"
  },
  period_certainty_help: {
    text: "<p>This will toggle <strong>Possibly</strong> at the beginning of the record.</p><hr class='compact'/><p>Set this to <strong>no</strong> to indicate that you believe that the text is correct, but are not entirely certain or cannot find documentation to verify this.</p><p>If you are only uncertain about portions of the record such as the name or location, use the individual certanty switches in the Extended Fields.</p>"
  },

  actions: {
    updateRecord: function(val) {
      this.model.set('updated',true);
      this.send("rebuildStructure");
    },
    updateProvenance: function(val) {
      this.model.rollback();
      var self = this;
      var id = this.model.get('id');
      Ember.$.post('/parse_provenance_line', {str: val})
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
      Ember.$.post('/parse_timestring', {str: val})
        .then(function(data){
          self.model.set('botb',moment.unix(data.botb))
          self.model.set('eotb',moment.unix(data.eotb))
          self.model.set('botb_precision',data.botb_precision)
          self.model.set('eotb_precision',data.eotb_precision)
          self.model.set('bote',moment.unix(data.bote))
          self.model.set('eote',moment.unix(data.eote)) 
          self.model.set('bote_precision',data.bote_precision)
          self.model.set('eote_precision',data.eote_precision)     
          self.model.set('updated',true);     
          self.send('rebuildStructure');
        });
    },
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});