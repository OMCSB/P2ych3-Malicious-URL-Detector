import pandas as pd

def equalizing_csv(df2):
    df2['result'] = df2['type'].apply(lambda x: 0 if x == 'benign' else 1)
    df2 = df2.rename(columns={'type': 'label'})
    return df2

def mod_csv_combine(df1, df2):
    df = pd.DataFrame()
    df = pd.concat([df, df1], axis=0) 
    df = pd.concat([df, df2], axis=0)
    newDFName = 'malicious_urls.csv' 
    df.to_csv(newDFName, index=False)
    return newDFName

def remove_duplicate(df_name):
    df = pd.read_csv(df_name)
    df = df.apply(lambda x: x.astype(str).str.lower()).drop_duplicates(subset=['url'], keep='first')
    return df

# def csv_combine(df1_name, df2_name):
#     files = ['{}, {}'.format(df1_name,df2_name)]
#     df = pd.DataFrame
#     for file in files:
#         data = pd.read_csv()
#         df = pd.concat([df, data], axis=0)
#     newDFName = 'malicious_urls.csv' 
#     df.to_csv(newDFName, index=False)
#     return newDFName


# df1_name = 'data/balanced_urls.csv'
# df2_name = 'data/malicious_phish.csv'

# df1 = pd.read_csv(df1_name)
# df2 = pd.read_csv(df2_name)

# df2 = equalizing_csv(df2)
# new_df_name = mod_csv_combine(df1, df2)


# row_count = df2.shape[0]
# print(row_count)

# df2 = equalizing_csv(df2)
# df2.to_csv(df2_name, index=False)

# row_count = df2.shape[0]
# print(row_count)





# print(df1.info())
# print(df2.info())
# print(df1.head())
# print(df2.head())