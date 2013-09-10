angular.module('lhplge')
.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  };
})
.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
        var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
        return function (amount, symbol) {
            var value = currency(amount, symbol);
            return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
        };
 }])
.filter('sumCapHit', function() {
  return function(input) {
    var total = 0;
    if (input){
        for (var i=0; i<input.length; i++)
          total = total + input[i].capHit;
        return total;
    }
    return null;
  };
})
.filter('agentsLibres', function(){
    return function(players, contracts){
        if (players && contracts){
            for (var i=0; i<contracts.length; i++)
                {
                    for(var j=0; j<players.length; j++)
                    {   
                        if (contracts[i].player == players[j].id){
                            delete players.splice(j, 1);
                        }
                    }    
                }
            return players; 
        }
        return null;
    };
});