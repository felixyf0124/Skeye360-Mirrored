# chromium role

Installs the latest version of the Chromium web browser.

It is installed as an apt package, so it gets upgraded using the
standard OS package management utilities.

After installation, in the XFCE desktop, you can change the default
system browser with the GUI application `Preferred Applications`.

## Role Variables

None.

## Example Playbook

To install the latest version:

```yaml
- hosts: all
  become: yes
  become_user: root
  roles:
   - role: tools/chromium
```
