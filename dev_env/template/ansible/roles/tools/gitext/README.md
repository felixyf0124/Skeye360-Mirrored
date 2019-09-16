# gitext role

Installs [git extensions](https://gerrit.ericsson.se/plugins/gitiles/eme/gitext/+/sv/HOW-TO-USE.txt).

## Role Variables

### username

user account name in which to install the tool.

The tool is installed in `/home/{{ username }}/tools/gitext` directory
and the `gitext/bin` directory gets added to the user's PATH in his `.profile` startup file.


## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/gitext
```
