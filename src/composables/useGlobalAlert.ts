import { Alert } from 'bootstrap';

export const useGlobalAlert = () => {
  const show = (message: string, type: 'success' | 'error' | 'danger') => {
    const globalAlert = document.getElementById('globalAlert');
    const appendAlert = (message: string, type: 'success' | 'error' | 'danger') => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = [
        `<div id="globalAlertInner">`,
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>',
        `</div>`
      ].join('');

      if (!globalAlert) return;

      globalAlert.append(wrapper);
    };

    appendAlert(message, type);

    setTimeout(() => {
      hide();
    }, 2000);
  };

  const hide = () => {
    new Alert('#globalAlertInner').close();
  };

  return {
    show,
    hide
  };
};
