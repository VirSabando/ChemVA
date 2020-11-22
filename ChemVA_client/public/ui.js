function sendSMILEStoServer(e) {

  //concat all the selected smiles formulas into one string
  var msg = {formulas:[]};
  if(selectedCompounds){
    for (let comp of selectedCompounds){
      let thisSmiles = data[comp].RDKit_Canonical_Smiles
      msg["formulas"].push({smiles: thisSmiles})
      // msg = msg.concat(thisSmiles);
      // msg = msg.concat(",");
    }
  } else {
    console.log("Empty selection");
    return;
  }
  // msg = msg.substring(0, msg.length - 1)
  // console.log(msg);

  if(run3D){
    //https://cs.uns.edu.ar/ChemVA/
    fetch('https://cs.uns.edu.ar/ChemVA/smiles_to_sdf', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msg)
    }).then(res => res.json())
      //update 3D view with the result
      .then(function(res){

          selectedSDFs = res.output;
          if(run3D)gameInstance.SendMessage("sdfReader", "ParseSDF", selectedSDFs.replace(/\n/g, "\\n"));

    });
  }

}

function sendNewCompound() {
  if(run3D){
    //https://cs.uns.edu.ar/ChemVA/
    fetch('https://cs.uns.edu.ar/ChemVA/new_compound', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({compound : {smiles: document.getElementById('compound_input').value, 
                            dataset: document.getElementById('dataset_input').value}})
    }).then(res => res.json())
      //update 3D view with the result
      .then(res => dealWithTheNewCompound(res));
  }

}

function dealWithTheNewCompound(res){

  var promise = new Promise((resolve, reject) => { 
    let newComp = {
      RDKit_Canonical_Smiles:                                 res.canonical_smiles,
      Molecule_ChEMBL_ID:                                     "new-"+data.length,
      Fingerprints_tsne_x:                                    res.fingerprint.x,
      Fingerprints_tsne_y:                                    res.fingerprint.y,
      Daylight_tsne_x:                                        res.daylight.x,
      Daylight_tsne_y:                                        res.daylight.y,
      Molecular_Descriptors_tsne_x:                           null,
      Molecular_Descriptors_tsne_y:                           null,
      Embeddings_tsne_x:                                      res.embedding.x,
      Embeddings_tsne_y:                                      res.embedding.y,
      Embeddings_Divergence_Pearson_Correlation:              null,
      Embeddings_Divergence_Kendall_Correlation:              null,
      Fingerprints_Divergence_Pearson_Correlation:            null,
      Fingerprints_Divergence_Kendall_Correlation:            null,
      Daylight_Divergence_Pearson_Correlation:                null,
      Daylight_Divergence_Kendall_Correlation:                null,
      Molecular_Descriptors_Divergence_Pearson_Correlation:   null,
      Molecular_Descriptors_Divergence_Kendall_Correlation:   null,
      Molecular_weight:                                       res.MolWt,
      aLogP:                                                  res.aLogP,
      cx_most_apka:                                           null,
      cx_most_bpka:                                           null,
      Lipinski_RO5_violations:                                null,
      Follows_Lipinskis_RO5:                                  null,
      QED_weighed:                                            null,
      Bioactivity_A:                                          null,
      Bioactivity_B:                                          null,
      Index:                                                  data.length
    }
    data.push(newComp);
    
    if(data.find(element => element === newComp)) return resolve();
  });

  //Once the data is loaded, create init views
  promise.then(function(resolve, reject){
    closeForm();
    startEverything();
  })
  
}

function downloadSDFfiles() {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(selectedSDFs));
  element.setAttribute('download', 'selectedSDFs.txt');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function saveSelection(){
  if(selectedCompounds.length != 0) savedSelections.push(selectedCompounds);
  createInputFormMenu('separator')
}

function loadSelection(index){
    selectedCompounds = savedSelections[index];
    //startEverything();
    lineUpSelection = selectedCompounds;
    lineup.setSelection(selectedCompounds);
}

function ReceiveSmileIndex(index){
  let firstCilcked = parseInt(index.split(' ')[0]);
  console.log(firstCilcked)
  if(!isNaN(firstCilcked)){
    // lineup.setHighlight(selectedCompounds[firstCilcked])
  }
}

