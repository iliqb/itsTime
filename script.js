document.addEventListener("DOMContentLoaded", () => {
  const countdownElement = document.getElementById("countdown");
  const eventInput = document.getElementById("event");
  const dateInput = document.getElementById("date");
  const goButton = document.getElementById("goButton");
  const dayLabel = document.getElementById("Days");
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
        dayLabel.textContent = "";
        if (diffDays === 0) {
          countdownElement.textContent = `Today is "${eventName}"!`;
        } else {
          countdownElement.textContent = `"${eventName}" already happened.`;
        }
        return;
      } else {
        // dayLabel.hidden = false / remove
        if (diffDays == 1) {
          dayLabel.textContent = "Day";
        } else {
          dayLabel.textContent = "Days";
        }
      }

      countdownElement.textContent = `${diffDays}`;
      chrome.action.setBadgeText({ text: `${diffDays}` });
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "0" });
  chrome.action.setBadgeBackgroundColor({ color: "#FF5733" });
});

chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: "${diffDays}" });
  chrome.action.setBadgeBackgroundColor({ color: "#007BFF" });
});

document.getElementById("donateButton").addEventListener("click", () => {
  const donateUrl = "https://paypal.me/iqb164?country.x=MX&locale.x=es_XC";
  window.open(donateUrl, "_blank");
});
