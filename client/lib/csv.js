// thanks http://cmatskas.com/importing-csv-files-using-jquery-and-html5/

// Method that checks that the browser supports the HTML5 File API
function __browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

    

// Method that reads and processes the selected file
CSVFile = {
    process : function(file, complete) {
        if (!__browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = null;
            
            var reader = new FileReader();
            reader.readAsText(file);
            
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toArrays(csvData);
                if (data && data.length > 0) {
                  complete(data);
                } else {
                    alert('No data to import!');
                }
            };

            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }

    // export : function(objects, keys) {
    //     // objects is a list of objects
    //     // keys is a list of data pieces we are interested in

    //     var rows = [keys];

    //     _.each(_.map(objects, function(o){
    //         return _.map(keys, function(k){
    //             return typeof o[k] !== 'undefined' ? o[k] : ' ';
    //         });
    //     }), function(r){
    //         rows.push(r);
    //     });

    //     var content =  _.reduce(rows, function(memo, row) {
    //         var sanitize 
    //         return memo + row.join(',') + '\n';
    //     }, '');

    //     saveAs(new Blob([content], {type: 'text/plain;charset=utf-8'}), 'helloworld.txt');
    // }
};