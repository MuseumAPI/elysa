App.HelpLabelComponent  = Ember.Component.extend({
  size: "col-sm-4",

  didInsertElement: function() {
    var c = this.get("help");
    if (c) {
      var options = {
        content: c.text,
        title: this.get("label"),
        trigger: "focus",
        placement: "auto",
        html: true,
        delay: {hide: 50},
      }
      var self = $(this.get('element'));
      console.log("self:",self)
      var el = self.find('.inline-editor-label');
      el.popover(options)
      self.find(".help").on("click",function() {
        return false
      });
    }
  }
})