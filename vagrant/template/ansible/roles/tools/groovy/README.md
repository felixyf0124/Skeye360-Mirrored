# groovy role

Installs groovy.

Also adds proper environment variables in the user's `.profile` file.


## Role Variables

See [defaults](defaults/main.yml) for role defaults for these variables.

### groovy_version

groovy version to install.

### groovy_install_dir

Root directory where to install groovy. groovy will actually install
in a subdirectory named after the groovy version.

### groovy_symlink_bin_dir

Where to create a symbolic link to the groovy executable.

### username

The user account name for whom to add the groovy environment variables.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/groovy
```

To install a specific version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/groovy, groovy_version: "2.4.15" }
```
