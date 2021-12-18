  WebFontConfig = {
    google: { families: [ 'Bangers::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
 
$(function(){
	
	$('#prenote').hide();
	$('#input').hide();
	$('#bang').hide();
	$('#results').hide();
	$('#wrap_up').hide();
	$('#negative_income_note').hide();
	$('#infinite_note').hide();
	
	var oldPA = 10600;
	$('input[name="oldPA"]').val(oldPA);
	var oldBasicRate = 20;
	$('input[name="oldBasicRate"]').val(oldBasicRate);
	var oldHighStart = 31786;
	$('input[name="oldHighStart"]').val(oldHighStart);
	var oldHighRate = 40;
	$('input[name="oldHighRate"]').val(oldHighRate);
	var oldAddStart = 150001;
	$('input[name="oldAddStart"]').val(oldAddStart);
	var oldAddRate = 45;
	$('input[name="oldAddRate"]').val(oldAddRate);
	var newPA = 12500;
	$('input[name="newPA"]').val(newPA);
	var newBasicRate = 20;
	$('input[name="newBasicRate"]').val(newBasicRate);
	var newHighStart = 37501;
	$('input[name="newHighStart"]').val(newHighStart);
	var newHighRate = 40;
	$('input[name="newHighRate"]').val(newHighRate);
	var newAddStart = 150001;
	$('input[name="newAddStart"]').val(newAddStart);
	var newAddRate = 45;
	$('input[name="newAddRate"]').val(newAddRate);
	
	
	function refreshTable() {
		$('.oldpa').html(numberWithCommas(oldPA));
		$('.newpa').html(numberWithCommas(newPA));
		$('.basicRate').html(oldBasicRate);
		$('.highRate').html(oldHighRate);
		$('.addRate').html(oldAddRate);
		}
	
	refreshTable();
	
	$(".dropdown-menu li a").click(function(e){
		$(this).parent().parent().parent().children('button').html($(this).text() + "&nbsp;<span class='caret'></span>").val($(this).text());
		e.preventDefault();
		});
		
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		
	function cast_to_int(x) {
		if (x == '') {
			return 0;
			} else {
			return parseInt(x);
			}
		}	

	function calcTaxes() {
		var grossRent = cast_to_int($('input[name="gross_rent"]').val());
		if ($('button[name="rent_period"]').val() == 'every month') {
			grossRent = grossRent * 12;
			}
		$('#grossRent').html(numberWithCommas(grossRent));
		
		
		var mortgageInterest = cast_to_int($('input[name="mortgage_interest"]').val());
		if ($('button[name="interest_period"]').val() == 'every month') {
			mortgageInterest = mortgageInterest * 12;
			}
		$('#mortgageInterest').html(numberWithCommas(mortgageInterest));

		var otherCosts = cast_to_int($('input[name="other_costs"]').val());
		if ($('button[name="other_costs_period"]').val() == 'every month') {
			otherCosts = otherCosts * 12;
			}
		$('#otherCosts').html(numberWithCommas(otherCosts));
			
		var otherIncome = cast_to_int($('input[name="other_income"]').val());
		if ($('button[name="other_income_period"]').val() == 'every month') {
			otherIncome = otherIncome * 12;
			}
		$('#otherIncome').html(numberWithCommas(otherIncome));
		
		var oldOperatingProfit = grossRent + otherIncome - otherCosts - mortgageInterest;
		$('#oldOperatingProfit').html(numberWithCommas(oldOperatingProfit));
		var oldTaxableProfit = oldOperatingProfit;
		$('#oldTaxableProfit').html(numberWithCommas(oldTaxableProfit));
		
		var newOperatingProfit = grossRent + otherIncome - otherCosts - mortgageInterest;
		$('#newOperatingProfit').html(numberWithCommas(newOperatingProfit));
		var newTaxableProfit = grossRent + otherIncome - otherCosts;
		$('#newTaxableProfit').html(numberWithCommas(newTaxableProfit));
		
		var oldLessPA = Math.max(oldOperatingProfit - oldPA,0);
		$('#oldLessPA').html(numberWithCommas(oldLessPA));
		
		var newLessPA = Math.max(newTaxableProfit - newPA,0);
		$('#newLessPA').html(numberWithCommas(newLessPA));
		
		var oldTax = sliceIncome(oldLessPA, 'old');
		$('#oldBasic').html(numberWithCommas(oldTax.basic));
		$('#oldHigher').html(numberWithCommas(oldTax.higher));
		$('#oldAdditional').html(numberWithCommas(oldTax.additional));
		
		var oldTotalTax = oldTax.basic + oldTax.higher + oldTax.additional;
		$('#oldTotalTax').html(numberWithCommas(oldTotalTax));
		 
		if (oldOperatingProfit == 0) {
			var oldETR = 0;
			} else {
			var oldETR = parseInt(oldTotalTax / oldOperatingProfit * 100); //effective tax rate
			}
		$('#oldETR').html(oldETR);
		
		var oldNetIncome = oldOperatingProfit - oldTotalTax;
		$('#oldNetIncome').html(numberWithCommas(oldNetIncome));
		
		var newTax = sliceIncome(newLessPA, 'new');
		$('#newBasic').html(numberWithCommas(newTax.basic));
		$('#newHigher').html(numberWithCommas(newTax.higher));
		$('#newAdditional').html(numberWithCommas(newTax.additional));
		
		var newMortgageRelief = parseInt(mortgageInterest * 0.2);
		$('#newMortgageRelief').html(numberWithCommas(newMortgageRelief));
		
		var newTotalTax = Math.max(newTax.basic + newTax.higher + newTax.additional - newMortgageRelief,0);
		$('#newTotalTax').html(numberWithCommas(newTotalTax));
		
		if (newOperatingProfit == 0) {
			var newETR = 0;
			} else {
			var newETR = parseInt(newTotalTax / newOperatingProfit * 100); //effective tax rate
			}
		$('#newETR').html(newETR);
		
		var newNetIncome = newOperatingProfit - newTotalTax;
		$('#newNetIncome').html(numberWithCommas(newNetIncome));
		
		/*if (newNetIncome < 0) {
			$('#newNetIncome').parent().addClass('danger');
			} else {
			$('#newNetIncome').parent().removeClass('danger');
			}*/
		
		if (oldTotalTax == 0 && newTotalTax > 0) {
			var percentIncrease = '&infin;';
			$('#infinite_note').show();
			} else if (oldTotalTax == 0 && newTotalTax == 0) {
			var percentIncrease = 0;
			$('#infinite_note').hide();
			} else {
			var percentIncrease = parseInt(((newTotalTax/oldTotalTax) - 1) * 100);
			$('#infinite_note').hide();
			}
		if (newNetIncome < 0) {
			$('#negative_income_note').show();
			} else {
			$('#negative_income_note').hide();
			}
		if (percentIncrease > 0) {
			$('#percentIncrease').html('+' + percentIncrease);
			} else{
			$('#percentIncrease').html(percentIncrease);
			}
		}
		
	function sliceIncome(i, regime) {
		
		if (regime == 'old') {
			addStart = oldAddStart;
			addRate = oldAddRate;
			highStart = oldHighStart;
			highRate = oldHighRate;
			basicRate = oldBasicRate;
			} else {
			addStart = newAddStart;
			addRate = newAddRate;
			highStart = newHighStart;
			highRate = newHighRate;
			basicRate = newBasicRate;
			}
		
		var taxes = {};
		
		if (i > addStart) {
			taxes.additional = parseInt((i - addStart) * (addRate / 100));
			} else {
			taxes.additional = 0;
			}
		
		if (i > highStart) {
			var minn = Math.min(i, addStart - highStart) - highStart + 1;
			//console.log(minn);
			taxes.higher = parseInt(minn * (highRate / 100));
			} else {
			taxes.higher = 0;
			}
		
		if (i > 0) {
			taxes.basic = parseInt(Math.min(i, highStart) * (basicRate / 100));
			} else {
			taxes.basic = 0;
			}
		
		//console.log(taxes);
		return taxes;		
		}
	
	$('#start').click(function(){
        $('#intro').hide("slide", { direction: "left" }, 300, function(){
			$('#prenote').show("slide", { direction: "right" }, 300);	
			});
		});
	$('#start2').click(function(){
        $('#prenote').hide("slide", { direction: "left" }, 300, function(){
			$('#input').show("slide", { direction: "right" }, 300);	
			});
		});
	$('#back_to_intro').click(function(){
        $('#input').hide("slide", { direction: "right" }, 300, function(){
			$('#intro').show("slide", { direction: "left" }, 300);	
			});
		});
	$('#bad_news').click(function(){
        $('#input').hide("slide", { direction: "left" }, 300, function(){
			$('#bang').show("slide", { direction: "right" }, 300);	
			});
		});
	$('#back_to_input').click(function(){
        $('#bang').hide("slide", { direction: "right" }, 300, function(){
			$('#input').show("slide", { direction: "left" }, 300);	
			});
		});
	$('#on_to_results').click(function(){
        $('#bang').hide("slide", { direction: "left" }, 300, function(){
			$('#results').show("slide", { direction: "right" }, 300);	
			});
		});
	$('#back_to_input_2').click(function(){
        $('#results').hide("slide", { direction: "right" }, 300, function(){
			$('#input').show("slide", { direction: "left" }, 300);	
			});
        });
	$('#to_wrap_up').click(function(){
        $('#results').hide("slide", { direction: "left" }, 300, function(){
			$('#wrap_up').show("slide", { direction: "right" }, 300);	
			});
        });
	$('#back_to_table').click(function(){
        $('#wrap_up').hide("slide", { direction: "right" }, 300, function(){
			$('#results').show("slide", { direction: "left" }, 300);	
			});
        });
	$('#start_over').click(function(){
        $('#wrap_up').hide("slide", { direction: "right" }, 300, function(){
			$('#intro').show("slide", { direction: "left" }, 300);	
			});
        });
	
	$( "body" ).keyup(function() {
		calcTaxes();
		});
	$( "body" ).click(function() {
		calcTaxes();
		});
	
	$('#saveSettings').click(function(){
		oldPA = $('input[name="oldPA"]').val();
		oldBasicRate = $('input[name="oldBasicRate"]').val();
		oldHigherStart = $('input[name="oldHighStart"]').val();
		oldHigherRate = $('input[name="oldHighRate"]').val();
		oldAddStart = $('input[name="oldAddStart"]').val();
		oldAddRate = $('input[name="oldAddRate"]').val();
		newPA = $('input[name="newPA"]').val();
		newBasicRate = $('input[name="newBasicRate"]').val();
		newHighStart = $('input[name="newHighStart"]').val();
		newHighRate = $('input[name="newHighRate"]').val();
		newAddStart = $('input[name="newAddStart"]').val();
		newAddRate = $('input[name="newAddRate"]').val();
		//console.log(oldPA + ', ' + oldBasicRate + ', ' + oldHigherStart + ', ' + oldHigherRate + ', ' + oldAddStart + ', ' + oldAddRate + ', ' + newPA + ', ' + newBasicRate + ', ' + newHighStart + ', ' + newHighRate + ', ' + newAddStart + ', ' + newAddRate);
		calcTaxes();
		refreshTable();
		});
});