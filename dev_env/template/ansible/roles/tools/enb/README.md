# enb role

Installs the Ericsson Netconf Browser.

A startup script `enb` is added to the system PATH.

## Role Variables

See the [defaults](defaults/main.yml) file for the current defaults for these variables.

### enb_version

The version of ENB to install.


## Example Playbook

To install the default version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/enb
```

To install a specific version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/enb, enb_version: "R7A08" }
```
