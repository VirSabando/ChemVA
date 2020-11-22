
var builder;
var ranking;

//function for preparing the builder for the LineUp table
function prepareLineUp(arrr){

    // generate some data
    // const arr = [];
    // const cats = ['c1', 'c2', 'c3'];
    // for (let i = 0; i < 100; ++i) {
    //   arr.push({
    //     a: Math.random() * 10,
    //     d: 'Row ' + i,
    //     cat: cats[Math.floor(Math.random() * 3)],
    //     cat2: cats[Math.floor(Math.random() * 3)]
    //   })
    // }
    // arr from before
    builder = LineUpJS.builder(arrr);

    // This is everything we might have in the LineUp
    builder
      // .column(LineUpJS.buildStringColumn('id').label('Label').width(300))
      // .column(LineUpJS.buildCategoricalColumn('cat', cats).color('red'))
      // .column(LineUpJS.buildCategoricalColumn('cat2', cats).color('blue'))
      // .column(LineUpJS.buildNumberColumn('a', [0, 10]).color('red'));
      .column(LineUpJS.buildStringColumn('Molecule_ChEMBL_ID').label('ID'))
      .column(LineUpJS.buildStringColumn('RDKit_Canonical_Smiles').label('SMILES').width(160))
      .column(LineUpJS.buildNumberColumn('Molecular_weight').color(colours[1]))
      .column(LineUpJS.buildNumberColumn('aLogP').color(colours[0]))
      .column(LineUpJS.buildNumberColumn('cx_most_apka').label('Acidic dissociation constant ').color(colours[2]))
      .column(LineUpJS.buildNumberColumn('cx_most_bpka').label('Basic dissociation constant').color(colours[3]))
      .column(LineUpJS.buildNumberColumn('Lipinski_RO5_violations').label('Lipinski RO5 violations').color(colours[5]))
      .column(LineUpJS.buildCategoricalColumn('Follows_Lipinskis_RO5').label('Follows Lipinski\'s RO5'))
      .column(LineUpJS.buildNumberColumn('QED_weighed').label('QED weighed').color(colours[6]))
      .column(LineUpJS.buildCategoricalColumn('Bioactivity_A').label('Serotonin 1a').color(colours[7]))
      .column(LineUpJS.buildCategoricalColumn('Bioactivity_B').label('Dopamin D2').color(colours[1]))
      .column(LineUpJS.buildNumberColumn('Fingerprints_Divergence_Pearson_Correlation').label('Pearson Correlation').color(colours[2]))
      .column(LineUpJS.buildNumberColumn('Fingerprints_Divergence_Kendall_Correlation').label('Kendall Correlation').color(colours[3]))
      .column(LineUpJS.buildCategoricalColumn('hex').label('Belongs to Hex'))
      .column(LineUpJS.buildStringColumn('Index').width(50))

    // this is the efinition of what we are gonna show
    ranking = LineUpJS.buildRanking()
      // .supportTypes()
      // .allColumns() // add all columns
      .aggregate('hex', true)
      .column('Index')
      .column('aLogP')
      .column('cx_most_apka')
      .column('cx_most_bpka')
      .column('Lipinski_RO5_violations')
      .column('Follows_Lipinskis_RO5')
      // .impose('# of Lipinski RO5 violations', 'Lipinski_RO5_violations', 'Follows_Lipinskis_RO5')
      .column('Molecular_weight')
      .column('QED_weighed')
      .column('Bioactivity_A')
      .column('Bioactivity_B')
      .column('Fingerprints_Divergence_Pearson_Correlation')
      .column('Fingerprints_Divergence_Kendall_Correlation')
      .column('RDKit_Canonical_Smiles')
      .column('hex')
      // .impose('a+cat', 'a', 'cat2') // create composite column
      // .groupBy('cat')
      // .sortBy('a', 'desc')
      .sortBy('Molecular_weight', 'desc')
      .groupBy('hex')


      

    builder
      // .defaultRanking()      
      .ranking(ranking)
      .expandLineOnHover(true)

    lineup = builder.build(document.getElementById("LineUp"));

    //Add listener, that would highlight all dots and hexes containing selected compound
    //This would handle all highlighing and selection because fuck yeah
    lineup.on("selectionChanged", function(e){

      // lineUpSelection = lineup.getSelection();
      if(lineup.getSelection().lenght !== 0){

        //Update lineUpSelection
        // lineUpSelection = lineup.getSelection().map(selco => lineupData[selco]['Index']);
        
        //Selected hexagons
        if(lineupData.length != 0) {
          //was it selected from lineup?
          //It's just inxedes of the data, so we need to fill them with real comp ids
          if(lineUpSelection != selectedCompounds){
            selectedCompounds = [];
            for(let selComp of lineup.getSelection()){
              selectedCompounds.push(lineupData[selComp]['Index'])
            }
          } else {
          //or from scatter plot
          // these are the real compound IDs, but we need to find corresponding comps in lineup
          //selected compounds stay the same

            lineUpSelection = [];
            for(let selComp of selectedCompounds){
              if(lineupData.indexOf(data[selComp]) != -1) lineUpSelection.push(lineupData.indexOf(data[selComp]))
            }

            lineup.setSelection(lineUpSelection);
          }

        } else {
          //all hexagons
          //INdexes in lineup and IDs are equal
          selectedCompounds = lineup.getSelection();
        }
        

        //reset all previously selected dots
        d3.selectAll(".dot").attrs({
                  "r" : 3.5
                })
        //and select the new ones
        for (let selComp of selectedCompounds){
            d3.selectAll("#dot_" + selComp)
              .each(function(d) {
                d3.select(this).attrs({
                  "r" : 7
                })
            })
        }
        //now highlight hexes that contain selected compounds
        //but first, delete highlights
        d3.selectAll(".hex").each(function(d) {
          if(selectedHexes.has(this.id) && d3.select(this).attr("tag") == "hex") {
              d3.select(this).attrs({
                  "stroke": "red",
                  "stroke-width": 5
                })
            } else {
                d3.select(this).attrs({
                  "stroke": "gray",
                  "stroke-width": 2
                })
            }
          });

        //console.log(selectionFromLineup)

        highlightHexesContainingSelectedCompounds();
      
      if(selectedCompounds.length != 0) sendSMILEStoServer();
      }
    });

}

function simpleLineUp(arr){
    // generate some data
    // const arr = [];
    // const cats = ['c1', 'c2', 'c3'];
    // for (let i = 0; i < 100; ++i) {
    //   arr.push({
    //     a: Math.random() * 10,
    //     d: 'Row ' + i,
    //     cat: cats[Math.floor(Math.random() * 3)],
    //     cat2: cats[Math.floor(Math.random() * 3)]
    //   })
    // }

    lineup = LineUpJS.asLineUp(document.getElementById("LineUp"), arr);
}