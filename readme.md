# User Generator

A Node.js script to generate randomized user data for database seeding or testing.  

Generates then writes to a file realistic-looking user data including usernames, passwords, emails, bios, account creation timestamps, date of birth, and account status.

This script is specifically for a database where the user table includes the following columns: ('username', 'email', 'password', 'bio', 'joined_at', 'dob', 'status').

---

## Features

- **Random usernames**: Combines adjectives and names for unique usernames.
- **Secure passwords**: Generates 60-character alphanumeric strings in the style of a BCrypt hashed password.
- **Emails**: Randomized emails with realistic domains.
- **User bios**: Short, semi-realistic bios using combinatorial templates.
- **Dates**: Random account creation timestamps and date of birth.
- **Account status**: Randomly assigned as `standard` or `premium`.
- **Batch generation**: Specify number of users to generate via CLI argument.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oisinhg-edu/user-generator
cd user-generator
```
2. Install dependencies:
```bash
npm install
```

## Usage
Run the script with node:
```bash
node usergen.js
```
A `users.sql` file will be created in the `user_generator` folder, ready to copy into mySql.

To generate multiple users, provide a CLI argument:
```bash 
node usergen.js X
```
where `X` is the amount of users to generate (integer).

## Acknowledgments
[unique-names-generator](https://www.npmjs.com/package/unique-names-generator) — for easy username generation  
[csv-parse](https://www.npmjs.com/package/csv-parse) - for parsing csv
