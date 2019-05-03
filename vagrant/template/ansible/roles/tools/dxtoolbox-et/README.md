# dxtoolbox-et role

Installs the DXToolbox ECIM toolset (Papyrus) for editing CM models.

A startup script `ecimToolChain` is added to the user's PATH.


## Role Variables

See the [defaults](defaults/main.yml) for the current defaults for these variables.

### dxtoolbox_et_version

The version of ECIM toolset to install.

## Example Playbook

To install the default version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/dxtoolbox-et
```

To install a specific version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/dxtoolbox-et, dxtoolbox_et_version: "3.3.0-105" }
```
