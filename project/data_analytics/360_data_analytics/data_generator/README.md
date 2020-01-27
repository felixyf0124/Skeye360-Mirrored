How to use time series data generator:
1. Change directory to tsimulus_generator folder
    ```
    cd tsimulus_generator
    ```    
2. Create dataset_generator_script
    
    reference: https://tsimulus.readthedocs.io/en/latest/
    
3. Execute the following command(ps: .json file is the file you created from step 2 and .csv is the file you want to create)
```
java -jar tsimulus-cli.jar [_dataset_generator_script.json_] > ../csv/[_filename.csv_]
```

4. Change directory to csv folder, and you will see your the generated csv file is there.