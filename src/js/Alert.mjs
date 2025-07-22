export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async loadAlerts() {
    try {
      const response = await fetch('./public/json/alerts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.alerts = await response.json();
    } catch (error) {
      this.alerts = [];
    }
  }

  renderAlerts() {
    if (!this.alerts || this.alerts.length === 0) {
      return '';
    }

    return this.alerts.map(alert => this.createAlertElement(alert)).join('');
  }

  createAlertElement(alert) {
    return `
      <section class="alert-list" style="background: ${alert.background}; color: ${alert.color};">
        <p>${alert.message}</p>
      </section>
    `;
  }

  async displayAlerts(targetElement) {
    await this.loadAlerts();
    
    if (this.alerts && this.alerts.length > 0) {
      const alertsHtml = this.renderAlerts();
      this.insertAlerts(targetElement, alertsHtml);
    }
  }

  insertAlerts(targetElement, alertsHtml) {
    if (typeof targetElement === 'string') {
      const element = document.querySelector(targetElement);
      if (element) {
        element.innerHTML = alertsHtml + element.innerHTML;
      }
    } else if (targetElement && targetElement.nodeType === Node.ELEMENT_NODE) {
      targetElement.innerHTML = alertsHtml + targetElement.innerHTML;
    }
  }
}
