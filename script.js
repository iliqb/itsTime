document.addEventListener("DOMContentLoaded", () => {
  const countdownElement = document.getElementById("countdown");
  const eventInput = document.getElementById("event");
  const dateInput = document.getElementById("date");
  const goButton = document.getElementById("goButton");
  let countdownInterval;

  function loadSavedEvent() {
    chrome.storage.sync.get(["eventName", "eventDate"], (result) => {
      if (result.eventName) {
        eventInput.value = result.eventName;
      }
      if (result.eventDate) {
        dateInput.value = result.eventDate;
        startCountdown(result.eventName, result.eventDate);
      }
    });
  }

  function saveEvent(eventName, eventDate) {
    chrome.storage.sync.set({ eventName, eventDate }, () => {
      console.log("saved", { eventName, eventDate });
    });
  }

  function startCountdown(eventName, eventDate) {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
      const today = new Date();
      const targetDate = new Date(eventDate);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffTime <= 0) {
        clearInterval(countdownInterval);
        if (diffTime === 0) {
          countdownElement.textContent = `Today is "${eventName}"!`;
        } else {
          countdownElement.textContent = `Your event "${eventName}" already happened.`;
        }
        return;
      }

      countdownElement.textContent = `${eventName} is in ${diffDays} day(s).`;
    }, 1000);
  }

  goButton.addEventListener("click", () => {
    const eventName = eventInput.value.trim();
    const eventDate = dateInput.value;

    if (!eventName || !eventDate) {
      alert("Please enter a valid date.");
      return;
    }

    saveEvent(eventName, eventDate);
    startCountdown(eventName, eventDate);
  });

  loadSavedEvent();
});
