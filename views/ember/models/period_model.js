App.Period = DS.Model.extend({
  artwork:                 DS.belongsTo('artwork'),
  order:                   DS.attr("number"),
  primary_owner:           DS.attr("boolean"),
  period_certainty:        DS.attr('default_true_boolean'),
  acquisition_method:      DS.attr('string'),
  party:                   DS.attr('string'),
  party_certainty:         DS.attr('default_true_boolean'),
  birth:                   DS.attr('julian'),
  birth_certainty:         DS.attr('default_true_boolean'),
  death:                   DS.attr('julian'),
  death_certainty:         DS.attr('default_true_boolean'),
  location:                DS.attr('string'),
  location_certainty:      DS.attr('default_true_boolean'),
  botb:                    DS.attr('julian'),
  botb_certainty:          DS.attr('default_true_boolean'),
  botb_precision:          DS.attr('number'),
  eotb:                    DS.attr('julian'),
  eotb_certainty:          DS.attr('default_true_boolean'),
  eotb_precision:          DS.attr('number'),
  bote:                    DS.attr('julian'),
  bote_certainty:          DS.attr('default_true_boolean'),
  bote_precision:          DS.attr('number'),
  eote:                    DS.attr('julian'),
  eote_certainty:          DS.attr('default_true_boolean'),
  eote_precision:          DS.attr('number'),
  original_text:           DS.attr('string'),
  provenance:              DS.attr('string'),
  parsable:                DS.attr('boolean'),
  direct_transfer:         DS.attr('boolean'),
  stock_number:            DS.attr('string'),
  footnote:                DS.attr('string'),
  earliest_possible:       DS.attr('julian'),
  latest_possible:         DS.attr('julian'),
  earliest_definite:       DS.attr('julian'),
  latest_definite:         DS.attr('julian'),
  acquisition_timestring:   DS.attr("string"),
  deacquisition_timestring: DS.attr("string"),
  timestring:              DS.attr("string"),

  active: false,
  updated: false,

  // Calculate a version of the text with removed text highlighted
  diffed_original_text: function() {
     var original = this.get('original_text');
     var modified = this.get('provenance');
     var diff = JsDiff.diffWords(original, modified);
     str = ""
      diff.forEach(function(part){
       if (part.removed) {
        str += "<span class='removed'>"
       }
       else if (part.added) {
        return;
       }
       str += part.value;
       if (part.removed) {
          str += "</span>"
       }
     });
     return str;
  }.property("original_text","provenance"),

  // Calculate a version of the provenance with added text highlighted
  diffed_provenance: function() {
     var original = this.get('original_text');
     var modified = this.get('provenance');
     var diff = JsDiff.diffWords(original, modified);

     str = ""
      diff.forEach(function(part){
       if (part.added) {
        str += "<span class='added'>" + part.value + "</span>"
       }
       else if (part.removed) {
        return;
       }
       else {
         str += part.value;
       }
     });
     return str;
  }.property("original_text","provenance"),

  partyName: function() {
    var party = this.get("party");
    if (party == ""){
      return "unknown party";
    }
    else if (this.get('acquisition_method') == "In Sale") {
      return party;// + " sale"
    }
    else{
      return party;
    }
  }.property('party', 'acquisition_method'),

  birth_year: function(key, value, previousValue) {
    if (arguments.length > 1) {
      if (value == "") {
        this.set('birth',null);
        return "";
      }
      var d =  moment.utc([value,1,1])
      if (d.isValid) {
        this.set('birth',d);
      }
    }   
    var val = this.get('birth');
    if(val) return val.year();
  }.property('birth'),

  death_year: function(key, value, previousValue) {
    if (arguments.length > 1) {
      if (value == "") {
        this.set('death',null);
        return "";
      }
      var d =  moment.utc([value,11,31])
      if (d.isValid()) {
        this.set('death',d);
      }
      else {
        this.set('death',null);
        return "";
      }
    }
    var val = this.get('death');
    if(val) return val.year();
  }.property('death'),

  computed_earliest_possible: function() {
    var e = this.get("earliest_possible");
    var c = this.get("artwork.creation_earliest");
    return e ? moment.max(e,c) : c;
  }.property("earliest_possible","artwork.creation_earliest"),

  footnote_number: function() {
    this.get("artwork.footnotes_updated");
    var footnoteCount = 0;
    var myVal = null;
    var self = this;
    var periods = this.get("artwork.sortedPeriods");
    periods.forEach(function(val) {
      var footnote = val.get("footnote");
      if (footnote && footnote != "") {
        footnoteCount++;
        if (val.get("id") == self.get("id")) {
          myVal = footnoteCount;
        }
      }
    });
    return myVal;
  }.property("artwork.footnotes_updated"),

  provenance_with_footnote: function() {
    var val = ""
    var footnote = this.get("footnote");
    val += this.get("provenance");
    if (footnote && footnote != "") {
      val += " [" +this.get("footnote_number") + "]";
    }
    if (val == "") val = this.get("partyName");
    return val
  }.property("provenance","footnote_number", "footnote", "partyName"),
});