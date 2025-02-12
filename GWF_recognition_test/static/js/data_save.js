
var prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

var resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);

		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt);
          psiturk.completeHIT(); // when finished saving compute bonus, the quit
			},
			error: prompt_resubmit
		});
	};

var save_data = function(final) {
  // exclude unwanted keys/columns
  var exclude_keys = ['internal_node_id','trial_index'];
  var clean_data = jsPsych.data.get().ignore(exclude_keys);
  var callback = function() {
    if (final) {
      // submit the HIT
      psiturk.saveData({
            success: function(){
              psiturk.completeHIT(); // when finished saving compute bonus, the quit
            },
            error: prompt_resubmit});
    }
  }
  /* Save participant data file */

  // Set participant data file name
  if (debug_mode) {
    var data_file_name = "dev_test.csv";

  } else {
    //var timestamp = (new Date).toISOString().replace(/z|t/gi,' ').trim();
  //  var data_file_name =  'S_' + subject_id +'-'+timestamp +'.csv';
    var data_file_name =  'S_' + useridtouse + '.csv';
  }

  // Save participant data file as a download in the web browser
  // Note that unlike saving server-side, this doesn't remove quotation marks from the CSV file
  if (data_save_method == 'csv_client') {
    clean_data.localSave('csv', data_file_name);
    // Save participant data file on a server side directory via PHP
    // (Broken: only works with Apache + PHP and no psiTurk)
  } else if(data_save_method == 'csv_server_php') {
    saveData(data_file_name, clean_data.csv())
    // Save participant data file on a server side directory via Python (only works with psiTurk)
  }  else if(data_save_method == 'csv_server_py') {
    $.ajax({
      type: 'POST',
      url: "../save_data_file",
      dataType: 'json',
      success: callback,
      error: callback,
      data: {
        file_name: data_file_name,
        file_data: clean_data.csv(),
      },
    });
  }
}
