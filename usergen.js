import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// use csv
const fileContent = fs.readFileSync('hobbylist.csv', 'utf-8');

const hobbyList = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});

// email arrays
const localParts = [];

const loadedDomains = fs.readFileSync('emaildomains.txt', 'utf-8');
const domains = loadedDomains.split('\n').map(line => line.trim()).filter(line => line !== '');

const alphaNumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const thirty_day_months = [4, 6, 9, 11];
const account_status_enums = ['standard', 'premium'];

const bioHobbies = hobbyList.map(r => r['Hobby-name']);
const bioEndings = [
    'looking for friends',
    'love to travel',
    'always learning',
    'enjoys new experiences',
    'passionate about life',
    'here to have fun',
    'excited to meet new people',
    'chasing dreams',
    'love meeting like-minded people',
    'exploring the world',
    'always curious',
    'seeking adventure',
    'finding joy in small things',
    'love sharing stories',
    'enjoys good conversations',
    'open to new ideas',
    'making the most of every day',
    'learning and growing',
    'friendly and approachable',
    'embracing challenges'
];

// use argument when running script
const numUsers = parseInt(process.argv[2]) || 1; // default 1

function gen_user_data() {

    let username = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: '',
        style: 'capital'
    });

    let email = gen_email();

    let password = gen_password_string();

    let bio = gen_bio();

    let joined_at = gen_timestamp_string();

    let dob = gen_date_string(1920, 2011);

    let account_status = account_status_enums[Math.floor(Math.random() * account_status_enums.length)];;

    let user_data = `('${username}', '${email}', '${password}', '${bio}.', '${joined_at}', '${dob}', '${account_status}')`;

    return user_data;
}

function gen_email() {
    let local = '';

    for (let i = 0; i < 8; i++) {
        let val = alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
        local += val;
    }

    let domain = domains[Math.floor(Math.random() * domains.length)];
    let email = `${local}` + '@' + `${domain}`;

    return email;
}

function gen_timestamp_string() {
    let date = gen_date_string(2010, 2025);

    let hour = Math.floor(Math.random() * 24);
    let mins = Math.floor(Math.random() * 60);
    let secs = Math.floor(Math.random() * 60);

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (secs < 10) {
        secs = '0' + secs;
    }

    let timestamp = `${date} ${hour}:${mins}:${secs}`;
    return timestamp;
}

function gen_date_string(min_year, max_year) {
    let max_day = 31;

    let year = Math.floor(Math.random() * (max_year - min_year + 1) + min_year);

    let month = Math.floor(Math.random() * (12 - 1) + 1);

    if (thirty_day_months.includes(month)) {
        max_day = 30;
    }
    else if (month == 2) {
        max_day = 28;
    }

    let day = Math.floor(Math.random() * (max_day) + 1);

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    let date = `${year}-${month}-${day}`;
    return date;
}

function gen_password_string() {
    let hash = '';

    for (let i = 0; i < 22; i++) {
        let val = alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
        hash += val;
    }

    let seed = '';

    for (let i = 0; i < 31; i++) {
        let val = alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
        seed += val;
    }

    let password = '$2y$10$' + hash + seed;
    return password;
}

function gen_bio() {
    let adj = uniqueNamesGenerator({
        dictionaries: [adjectives]
    });

    let hobby = bioHobbies[Math.floor(Math.random() * bioHobbies.length)];
    let ending = bioEndings[Math.floor(Math.random() * bioEndings.length)];

    return `I am a ${adj} person who enjoys ${hobby}, ${ending}`;
}

if (numUsers === 1) {
    fs.writeFileSync('users.sql', gen_user_data());
}
else {
    let outputStr = '';

    for (let i = 0; i < numUsers - 1; i++) {
        outputStr += gen_user_data() + ',\n';
    }

    outputStr += gen_user_data();
    fs.writeFileSync('users.sql', outputStr);
}