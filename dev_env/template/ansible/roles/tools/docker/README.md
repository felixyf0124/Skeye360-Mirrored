# docker role

The latest version of both `docker` and `docker-compose` are installed and are in your PATH.
They are setup so you don't need sudo to run them.

docker is installed as an apt package so it gets upgraded by the OS package manager.

docker-compose can be upgraded with `vagrant provision`.

## Role Variables

### username

User to add to the docker group so he doesn't need sudo to run docker.
Normally not needed as the default will be the user set in the `vagrant.yml` file.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/docker
```
