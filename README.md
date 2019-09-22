# Soen490 capstone project

# Running the Frontend on Docker

1. Launch the VM with `vagrant up` 
2. Inside the VM, navigate to `/Soen490/projects/frontend/redux-cra/`
3. Open the terminal at that location.
4. Type `docker build -t image_name .` to build a Docker image. 
5. Type `docker run -p 8000:8000 -i -t image_name`

Note: `8000:8000` a placeholder port. It will be changed accordingly to the port we choose. 
