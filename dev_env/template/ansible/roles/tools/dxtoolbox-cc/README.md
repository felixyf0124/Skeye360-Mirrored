# dxtoolbox-cc role

Installs the dxtoolbox-cc cross-compilers, the core MW libraries and LDE libraries.

The installation is stripped down to the minimum required to compile JavaCC
applications.

Updates environments variables in the user's `~/.profile`.


## Role Variables

See the [defaults file](defaults/main.yml) for the current default values
for these variables.

### dxtoolbox_cc_tools_dir

Directory where to install all the tools.

### dxtoolbox_cc_version

The version of the cross-compiler to install.

### ldews_api_version

The version of the LDEWS API to install.

### coremw_sdk_version

The version of the COREMW SDK to install.


## Example Playbook

To install the default versions specified in the role:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/dxtoolbox-cc
```

To install specific versions in a custom location:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - { role: tools/dxtoolbox-cc,
       dxtoolbox_cc_tools_dir: "/opt/dxtoolbox-cc",
       dxtoolbox_cc_version: "3.4.0-15",
       ldews_api_version: "4.5.1-2",
       coremw_sdk_version: "4.5.2-04"
     }
```
