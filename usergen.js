import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';

// stores unique values
const seenName = new Set();

// use csv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hobbyPath = path.join(__dirname, 'data/hobbylist.csv');

const fileContent = fs.readFileSync(hobbyPath, 'utf-8');

const hobbyList = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});

// email arrays
const localParts = [];

const domainPath = path.join(__dirname, 'data/emaildomains.txt');

const loadedDomains = fs.readFileSync(domainPath, 'utf-8');
const domains = loadedDomains.split('\n').map(line => line.trim()).filter(line => line !== '');

const alphaNumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const thirtyDayMonths = [4, 6, 9, 11];

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

function genUserData() {

    let username = getUniqueUsername();

    let email = genEmail();

    let password = genPasswordString();

    let bio = genBio();

    let joined_at = genTimestampString(2015, 2025);

    let dob = genDateString(1965, 2011);

    // 15% chance for a premium user
    let account_status = Math.random() < 0.15 ? 'premium' : 'standard';

    let userData = `('${username}', '${email}', '${password}', '${bio}.', '${joined_at}', '${dob}', '${account_status}')`;

    return userData;
}

function genUsername() {
    let base = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: '',
        style: 'capital'
    });


    let suffix = randomString(3);

    return base + suffix;
}

function getUniqueUsername() {
    let name;

    do {
        name = genUsername();
    }
    while (seenName.has(name));

    seenName.add(name);

    return name;
}

function genEmail() {
    let local = randomString(8);

    let domain = domains[Math.floor(Math.random() * domains.length)];
    let email = `${local}` + '@' + `${domain}`;

    return email;
}

function genPasswordString() {
    let hash = randomString(22);
    let seed = randomString(31);

    let password = '$2y$10$' + hash + seed;
    return password;
}

function genBio() {
    let adj = uniqueNamesGenerator({
        dictionaries: [adjectives]
    });

    let hobby = chooseFromArray(bioHobbies);
    let ending = chooseFromArray(bioEndings);

    return `I am a ${adj} person who enjoys ${hobby}, ${ending}`;
}

function genTimestampString(min_year, max_year) {
    let date = genDateString(min_year, max_year);

    let hour = Math.floor(Math.random() * 24);
    let mins = Math.floor(Math.random() * 60);
    let secs = Math.floor(Math.random() * 60);

    let timestamp = `${date} ${padZero(hour)}:${padZero(mins)}:${padZero(secs)}`;
    return timestamp;
}

function genDateString(min_year, max_year) {
    let max_day = 31;

    let year = Math.floor(Math.random() * (max_year - min_year + 1) + min_year);

    let month = Math.floor(Math.random() * (12) + 1);

    if (thirtyDayMonths.includes(month)) {
        max_day = 30;
    }
    else if (month == 2) {
        max_day = 28;
    }

    let day = Math.floor(Math.random() * (max_day) + 1);

    let date = `${year}-${padZero(month)}-${padZero(day)}`;
    return date;
}

// pick one value from an array or a string
function chooseFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// adds a leading 0 to a number if it is below 10
function padZero(n) {
    return n < 10 ? '0' + n : n;
}

// creates a random string of given length 
// default alphabet is the alphaNumeric array
function randomString(length, alphabet = alphaNumeric) {
    let s = '';
    for (let i = 0; i < length; i++) {
        s += chooseFromArray(alphabet);
    }
    return s;
}

function resetUsers() {
    seenName.clear();
}
// insert into `user` ( `username`, `email`, `password`, `bio`, `joined_at`, `dob`, `status`) values\n

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (numUsers === 1) {
        fs.writeFileSync('data.sql', 'insert into `user` ( `username`, `email`, `password`, `bio`, `joined_at`, `dob`, `status`) values\n' + genUserData() + ';');
    }
    else {
        let outputArr = [];

        for (let i = 0; i < numUsers; i++) {
            outputArr.push(genUserData());
        }

        fs.writeFileSync('data.sql', 'insert into `user`(`username`, `email`, `password`, `bio`, `joined_at`, `dob`, `status`)\nvalues\n' + outputArr.join(',\n') + ';');
    }
}

export {
    genUserData,
    genTimestampString,
    resetUsers,
    chooseFromArray
}