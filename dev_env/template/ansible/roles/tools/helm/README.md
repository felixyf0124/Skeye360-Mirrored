# helm role

Installs [helm](https://helm.sh/), the package manager for kubernetes.

Also installs helm bash completion in the user's `.bashrc` file.

## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### helm_version

The version of helm to install.

### username

Name of the user for which to install helm bash completion.

### userhome

Home directory of the user.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/helm
```

To install a specific version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/helm, helm_version: "v2.12.3" }
```
