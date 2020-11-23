from features import featurize
from sys import argv

path_to_model = 'model_300dim.pkl'
path_to_input = 's.smi'
path_to_output = 'embeddings_new_compound.csv'

featurize(path_to_input, path_to_output, path_to_model, r=1, uncommon = 'UNK')
