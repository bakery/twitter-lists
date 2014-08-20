Template.lookupList.events({
    'submit form' : function(e, template){
        e.stopImmediatePropagation();

        var listData = Twitter.parseListUrl(template.$('input[name="url"]').val());
        var submitButton = template.$('button');

        if(listData){

            submitButton.attr('disabled','disabled');

            SessionMethod.call('lookupList', { list : listData}, function(error,data){
                if(error){
                    alert('Lookup failed');
                }

                submitButton.removeAttr('disabled');
            });
        } else {
            alert('this does not look like a list url');
        }

        return false;
    }
});