const { DateTime } = require('luxon');
const handlebars = require('handlebars');

export default function createHandlebarsConfig() {
  return {
    extname: '.hbs',
    helpers: {
      timeDifference(dateGiven) {
        const relativeTime = DateTime.local()
          .minus(new Date() - dateGiven)
          .toRelative();
        return relativeTime === 'in 0 seconds' ? 'Just now' : relativeTime;
      },
      timeFormatter(dateGiven) {
        return DateTime.fromJSDate(dateGiven).toLocaleString(
          DateTime.DATETIME_MED
        );
      },
      if_eq(a, b, opts) {
        if (a === b) return opts.fn(this);
        return opts.inverse(this);
      },
      unescapeText(inputData) {
        if (inputData) {
          return new handlebars.SafeString(inputData);
        }
        return '';
      },
    },
  };
}
