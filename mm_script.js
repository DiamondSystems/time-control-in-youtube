// ==UserScript==
// @name EXT YouTube timer
// @author DiamondSystems
// @license GPLv3
// @version 1.012
// @include https://www.youtube.com/*
// @grant none
// @run-at document-start
// ==/UserScript==

/**
 * ------------------------------------------
 * Settings
 * ------------------------------------------
 **/
const workingHours = {
    from: 6,
    to:   18
};
const dailyLimitInMinutes = 120;
const reminderIntervalInSeconds = 600;
const checkIntervalInSeconds = 10;
const redirectUrl = "https://www.google.com/search?q=motivation+to+work";


/**
 * ------------------------------------------
 * STOP! Everything else is a matrix ;)
 * ------------------------------------------
 **/
const extYT = {
    dayId: null,
    currentUrl: null,
    intervalHandlers: {
        newPageControl: null,
        setReminder: null,
        setTimer: null,
    },

    extYoutubeTimer: function()
    {
        if (document.hidden)
            setTimeout(extYT.extYoutubeTimer, 5000);
        else
        {
            extYT.playerMode(true);
            setTimeout(function()
            {
                if (confirm("You're not working?"))
                {
                    extYT.saveTimerData();

                    if ((extYT.currentHour >= workingHours.from && extYT.currentHour < workingHours.to) || localStorage.getItem('stop') === '1')
                        extYT.stopYoutube();
                    else
                    {
                        extYT.setTimer();
                        extYT.newPageControl();
                        extYT.setReminder();
                    }
                }
                else
                {
                    extYT.newPageControl();
                    extYT.setReminder();
                }
            }, 500);
        }
    },

    newPageControl: function()
    {
        extYT.currentUrl = document.location.href;
        if (extYT.intervalHandlers.newPageControl !== null)
            return;

        extYT.intervalHandlers.newPageControl = setInterval(function()
        {
            if (extYT.currentUrl === document.location.href)
                return;
            if (extYT.intervalHandlers.setTimer !== null)
                clearInterval(extYT.intervalHandlers.setTimer);
            extYT.extYoutubeTimer();
        }, 5000);
    },

    setReminder: function()
    {
        if (extYT.intervalHandlers.setReminder !== null)
            return;

        extYT.intervalHandlers.setReminder = setInterval(function()
        {
            extYT.playerMode(true);
            setTimeout(function()
            {
                if (confirm('Maybe enough already?'))
                    extYT.stopYoutube();
                else
                    setTimeout(function() { extYT.playerMode(false); },500);
            }, 500);
        }, reminderIntervalInSeconds * 1000);
    },

    setTimer: function()
    {
        extYT.intervalHandlers.setTimer = setInterval(function()
        {
            if (document.hidden)
                return;

            let timer = localStorage.getItem('timer');
            timer = (timer === null) ? 0 : parseInt(timer);
            localStorage.setItem('timer', timer+checkIntervalInSeconds);

            if (timer >= (dailyLimitInMinutes * 60))
            {
                localStorage.setItem('stop', '1');
                extYT.stopYoutube();
            }
        }, checkIntervalInSeconds * 1000);
    },

    saveTimerData: function()
    {
        if (extYT.dayId !== null)
            return;

        extYT.dayId    = extYT.date.getMonth() + extYT.date.getDay();
        let savedDayId = localStorage.getItem('dayId');
            savedDayId = (savedDayId == null) ? 0 : parseInt(savedDayId);

        if (savedDayId !== extYT.dayId)
        {
            localStorage.setItem('dayId', extYT.dayId.toString());
            localStorage.setItem('timer', '0');
            localStorage.setItem('stop', '0');
        }
    },

    clearIntervals: function()
    {
        const ih = extYT.intervalHandlers;
        if (ih.newPageControl !== null)
            clearInterval(ih.newPageControl);
        if (ih.setReminder !== null)
            clearInterval(ih.setReminder);
        if (ih.setTimer !== null)
            clearInterval(ih.setTimer);
        ih.newPageControl = ih.setReminder = ih.setTimer = null;
    },

    stopYoutube: function()
    {
        extYT.clearIntervals();

        if (document.body !== null)
        {
            document.body.style.background = '#181818';
            document.body.style.color = '#fff';
            document.body.style.fontSize = '60px';
            document.body.innerHTML = '<div style="text-align:center">:)</div>';

            setTimeout(extYT.redirectFromYoutube, 1000);
        }
        else
            extYT.redirectFromYoutube();
    },

    playerMode: function(isPause)
    {
        const player = document.getElementById('movie_player');  // or .getElementsByClassName("html5-main-video")[0]
        if (player === null || document.hidden)
            return;

        if ((player.parentElement.getElementsByClassName('paused-mode').length > 0 && ! isPause) ||
            (player.parentElement.getElementsByClassName('playing-mode').length > 0 && isPause))
        {
            player.click();
        }
    },

    redirectFromYoutube: function()
    {
        document.location.href = redirectUrl;
    },

    init: function()
    {
        // do not run in frames
        const w = (unsafeWindow !== "undefined") ? unsafeWindow : window;
        if (w.self !== w.top)
            return;

        // save dates
        this.date = new Date();
        this.currentHour = this.date.getHours();

        // run
        this.extYoutubeTimer();
    }
};
extYT.init();