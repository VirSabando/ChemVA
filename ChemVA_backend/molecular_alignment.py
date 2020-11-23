from rdkit import Chem
from rdkit.Chem import rdFMCS, AllChem
import pickle as pkl
import os

#-----------------------------------------------------------------------
#                    PYTHON  FUNCTIONS - SDF & ALIGNMENT
#-----------------------------------------------------------------------

# Step 0 - generate a list of molecules based on a long string of smiles
def generate_list_of_mols(whole_string_of_smiles):
    # Assume my whole string of smiles has all smiles separated by ','
    s = whole_string_of_smiles.split(',')
    m = [Chem.MolFromSmiles(elem) for elem in s]
    return m

# Step 1 - find Maximum Common Substructure (MCS)
def find_mcs(whole_string_of_smiles):
    m = generate_list_of_mols(whole_string_of_smiles)
    res = rdFMCS.FindMCS(m)
    return res.smartsString

# Step 2 - get 3D conformations from a precomputed pool
def get_precomputed_3D_conformations(whole_string_of_smiles):
    # Always assuming my smiles are concatenated and separated by ','
    s = whole_string_of_smiles.split(',')

    # separate ref from prob compounds
    ref_compound = s[0]
    prob_compounds = s

    # get precomputed conformations - Using dictionary_all_data.p
    dict_conformations = pkl.load(open(os.getcwd()+'/public/resources/dictionaries/dictionary_all_data.p','rb'))
    ref_sdf = dict_conformations.get(ref_compound)
    prob_sdf = ''
    for c in prob_compounds:
        c_sdf = dict_conformations.get(c)
        prob_sdf = prob_sdf + c_sdf
        if c_sdf[-1] != '\n':
            prob_sdf = prob_sdf + '\n'

    to_return = (ref_sdf, prob_sdf)
    return to_return

# Step 3 - call obfit command for molecular alignment
def calculate_molecular_alignment(whole_string_of_smiles):
    mcs_SMARTS_pattern = find_mcs(whole_string_of_smiles)
    ref_sdf, prob_sdf = get_precomputed_3D_conformations(whole_string_of_smiles)

    # dump temporary sdf files for obfit's use
    # (will be overwritten with each call of this fn)
    ref_file_path = os.getcwd()+'/public/temp/ref_sdf.sdf'
    prob_file_path = os.getcwd()+'/public/temp/prob_sdf.sdf'
    output_file_path = os.getcwd()+'/public/temp/aligned_sdf.sdf'

    ref_fd = open(ref_file_path,'w')
    ref_fd.write(ref_sdf)
    ref_fd.close()

    prob_fd = open(prob_file_path,'w')
    prob_fd.write(prob_sdf)
    prob_fd.close()

    # actual alignment - needs all these auxiliary files to work :(
    os.system('obfit \'' + mcs_SMARTS_pattern + '\' ' + ref_file_path + ' ' + prob_file_path + ' > ' + output_file_path)

    aligned_sdf_string = open(output_file_path, 'r').read()
    return aligned_sdf_string
