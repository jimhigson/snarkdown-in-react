import { expect, test } from "vitest";
import { parse } from "./snarkdown-in-react";

// !!!!!!!!!!!!! examples from Head over Heels online, !!!!!!!!!!!!!!!
// see: https://blockstack.ing to play the game
// or: https://github.com/jimhigson/head-over-heels-online for the source code
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

test("blacktooth.md", () => {
  expect(
    parse(`## BLACKTOOTH

![](texture-blacktooth.wall.armour.left?bg-pureBlack)![](texture-blacktooth.wall.shield.away?bg-pureBlack&float-right)This planet has a large moon with three lunar space stations on it, the larger
of these, *Moon Station HQ*, is the main teleport center for the empire, with a
direct teleport to all the slave planets.

Sometime after the Egyptus episode,
the latest Emperor sent out a craft to find that same strange planet, and after
much exploration, it was finally located, and the craft landed. However, the
crew found the people had changed: instead of pyramids they used castles,
instead of wrapping corpses up in cloth, they wrapped living men in metal and
then tried to turn them into corpses with sharp metal sticks.

![](texture-teleporter)The Emperor, not to be outdone by his ancestor, built a castle on Blacktooth and
used it as his headquarters. The castle is surrounded by a small market, and
then a range of impassable mountains. The only way to leave is via teleport to
one of the three lunar space stations.

*> head over heels manual*`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        BLACKTOOTH
      </h2>
      <p>
        <img
          src="texture-blacktooth.wall.armour.left?bg-pureBlack"
        />
        <img
          src="texture-blacktooth.wall.shield.away?bg-pureBlack&float-right"
        />
        This planet has a large moon with three lunar space stations on it, the larger
    of these, 
        <em>
          Moon Station HQ
        </em>
        , is the main teleport center for the empire, with a
    direct teleport to all the slave planets.
      </p>
      <p>
        Sometime after the Egyptus episode,
    the latest Emperor sent out a craft to find that same strange planet, and after
    much exploration, it was finally located, and the craft landed. However, the
    crew found the people had changed: instead of pyramids they used castles,
    instead of wrapping corpses up in cloth, they wrapped living men in metal and
    then tried to turn them into corpses with sharp metal sticks.
      </p>
      <p>
        <img
          src="texture-teleporter"
        />
        The Emperor, not to be outdone by his ancestor, built a castle on Blacktooth and
    used it as his headquarters. The castle is surrounded by a small market, and
    then a range of impassable mountains. The only way to leave is via teleport to
    one of the three lunar space stations.
      </p>
      <p>
        <em>
          &gt; head over heels manual
        </em>
      </p>
    </React.Fragment>
  `);
});

test("crowns.md", () => {
  expect(
    parse(`## CROWNS

![](texture-crown.blacktooth)![](texture-crown.bookworld?float-right)![](texture-crown.egyptus?clear-left)![](texture-crown.penitentiary?float-right&clear-right)![](texture-crown.safari?clear-left)Find a crown and start a revolution. At the beginning of each game, a screen
showing all five planets with a crown above each will be displayed.

As each
crown is collected this screen will be shown again with the appropriate crowns
in a bright color.

*> head over heels manual*`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        CROWNS
      </h2>
      <p>
        <img
          src="texture-crown.blacktooth"
        />
        <img
          src="texture-crown.bookworld?float-right"
        />
        <img
          src="texture-crown.egyptus?clear-left"
        />
        <img
          src="texture-crown.penitentiary?float-right&clear-right"
        />
        <img
          src="texture-crown.safari?clear-left"
        />
        Find a crown and start a revolution. At the beginning of each game, a screen
    showing all five planets with a crown above each will be displayed.
      </p>
      <p>
        As each
    crown is collected this screen will be shown again with the appropriate crowns
    in a bright color.
      </p>
      <p>
        <em>
          &gt; head over heels manual
        </em>
      </p>
    </React.Fragment>
  `);
});

test("cuddlyStuffedWhiteRabbits.md", () => {
  expect(
    parse(`## CUDDLY STUFFED WHITE RABBITS

![](texture-bunny?float-right)The *cute toy bunnies* magically enhance your powers. The status display at the
bottom of the screen will keep you informed as to which powers are temporarily
enhanced.

If Head and Heels are connected when they pick up a *Life* or *Iron pill*,
they will both get the enhanced power.

There are four types:

1. ![](texture-hud.char.2?sprite-tinted&text-metallicBlue)**Two extra lives**
2. ![](texture-hud.shield?sprite-tinted&text-metallicBlue)**Iron Pills** (to make you invulnerable)
3. ![](texture-hud.bigJumps?sprite-tinted&text-metallicBlue)**Jump higher bunny** (only works on Heels)
4. ![](texture-hud.fastSteps?sprite-tinted&text-metallicBlue)**Go faster bunny** (only works on slow-moving Head)

*> Head Over Heels Manual*`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        CUDDLY STUFFED WHITE RABBITS
      </h2>
      <p>
        <img
          src="texture-bunny?float-right"
        />
        The 
        <em>
          cute toy bunnies
        </em>
         magically enhance your powers. The status display at the
    bottom of the screen will keep you informed as to which powers are temporarily
    enhanced.
      </p>
      <p>
        If Head and Heels are connected when they pick up a 
        <em>
          Life
        </em>
         or 
        <em>
          Iron pill
        </em>
        ,
    they will both get the enhanced power.
      </p>
      <p>
        There are four types:
      </p>
      <ol>
        <li>
          <img
            src="texture-hud.char.2?sprite-tinted&text-metallicBlue"
          />
          <strong>
            Two extra lives
          </strong>
        </li>
        <li>
          <img
            src="texture-hud.shield?sprite-tinted&text-metallicBlue"
          />
          <strong>
            Iron Pills
          </strong>
           (to make you invulnerable)
        </li>
        <li>
          <img
            src="texture-hud.bigJumps?sprite-tinted&text-metallicBlue"
          />
          <strong>
            Jump higher bunny
          </strong>
           (only works on Heels)
        </li>
        <li>
          <img
            src="texture-hud.fastSteps?sprite-tinted&text-metallicBlue"
          />
          <strong>
            Go faster bunny
          </strong>
           (only works on slow-moving Head)
        </li>
      </ol>
      <p>
        <em>
          &gt; Head Over Heels Manual
        </em>
      </p>
    </React.Fragment>
  `);
});

test("swopKey.md", () => {
  expect(
    parse(`## SWOP KEY

If Head is sitting on Heels, the swop key will, on each push, give you control
of:

* *1* Heels.
* *2* Head + Heels.
* *3* Head.
* *4* Head + Heels.

If Head is not on Heels, the swop key will, on each push, give you control of:

* *1* Head.
* *2* Heels.

At all times, the character(s) whose icon is lit is under player control. When
Head and Heels are joined together, all their abilities are combined.

*> head over heels manual*`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        SWOP KEY
      </h2>
      <p>
        If Head is sitting on Heels, the swop key will, on each push, give you control
    of:
      </p>
      <ul>
        <li>
          <em>
            1
          </em>
           Heels.
        </li>
        <li>
          <em>
            2
          </em>
           Head + Heels.
        </li>
        <li>
          <em>
            3
          </em>
           Head.
        </li>
        <li>
          <em>
            4
          </em>
           Head + Heels.
        </li>
      </ul>
      <p>
        If Head is not on Heels, the swop key will, on each push, give you control of:
      </p>
      <ul>
        <li>
          <em>
            1
          </em>
           Head.
        </li>
        <li>
          <em>
            2
          </em>
           Heels.
        </li>
      </ul>
      <p>
        At all times, the character(s) whose icon is lit is under player control. When
    Head and Heels are joined together, all their abilities are combined.
      </p>
      <p>
        <em>
          &gt; head over heels manual
        </em>
      </p>
    </React.Fragment>
  `);
});

test("theGame.md", () => {
  expect(
    parse(`## THE GAME

![](texture-heels.walking.right.2)![](texture-animated-head.idle.towards?float-right&clear-left)Head and Heels have been captured, separated and imprisoned in the castle
headquarters of Blacktooth. Their cells contain ‘keep fit’ equipment, including
a wall ladder that Head really must learn to climb.

![](texture-market.wall.fruits.left?bg-pureBlack)![](texture-moonbase.wall.window2.away?bg-pureBlack&float-right) Your job is to get them both
out of the castle and into the *marketplace* so they can join up again. From
there, the journey leads to *Moonbase Headquarters*, where you will have to decide
either to try to escape back to *Freedom* or to be a true hero and teleport to one
of the slave planets to search for its lost crown!

![](texture-crown.bookworld)To overthrow the dictatorship on any of the slave planets would be a major blow
to Blacktooth and you could return to Freedom in glory. Of course, Blacktooth
would probably enslave them again eventually but it would slow down any
expansion plans for now.


![](texture-cyberman.towards?float-right&relative&z-topSprite)![](texture-animated-bubbles.cold?float-right&clear-right&relative&bottom-bottomStackPullup)The populace of Blacktooth are so heavily oppressed
that they would have to see all four of the slave planets revolt before the
Blacktooth crown could cause an uprising. ![](texture-animated-turtle.right)This of course would be the ultimate
accolade, and unfortunately, almost certain suicide.

*> Head Over Heels Manual*`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        THE GAME
      </h2>
      <p>
        <img
          src="texture-heels.walking.right.2"
        />
        <img
          src="texture-animated-head.idle.towards?float-right&clear-left"
        />
        Head and Heels have been captured, separated and imprisoned in the castle
    headquarters of Blacktooth. Their cells contain ‘keep fit’ equipment, including
    a wall ladder that Head really must learn to climb.
      </p>
      <p>
        <img
          src="texture-market.wall.fruits.left?bg-pureBlack"
        />
        <img
          src="texture-moonbase.wall.window2.away?bg-pureBlack&float-right"
        />
         Your job is to get them both
    out of the castle and into the 
        <em>
          marketplace
        </em>
         so they can join up again. From
    there, the journey leads to 
        <em>
          Moonbase Headquarters
        </em>
        , where you will have to decide
    either to try to escape back to 
        <em>
          Freedom
        </em>
         or to be a true hero and teleport to one
    of the slave planets to search for its lost crown!
      </p>
      <p>
        <img
          src="texture-crown.bookworld"
        />
        To overthrow the dictatorship on any of the slave planets would be a major blow
    to Blacktooth and you could return to Freedom in glory. Of course, Blacktooth
    would probably enslave them again eventually but it would slow down any
    expansion plans for now.
      </p>
      <p>
        <img
          src="texture-cyberman.towards?float-right&relative&z-topSprite"
        />
        <img
          src="texture-animated-bubbles.cold?float-right&clear-right&relative&bottom-bottomStackPullup"
        />
        The populace of Blacktooth are so heavily oppressed
    that they would have to see all four of the slave planets revolt before the
    Blacktooth crown could cause an uprising. 
        <img
          src="texture-animated-turtle.right"
        />
        This of course would be the ultimate
    accolade, and unfortunately, almost certain suicide.
      </p>
      <p>
        <em>
          &gt; Head Over Heels Manual
        </em>
      </p>
    </React.Fragment>
  `);
});

test("penitentiary.md", () => {
  expect(
    parse(`## PENITENTIARY
### The empire's prison planet

![](texture-penitentiary.wall.skeleton.left)Millions are imprisoned here. A harsh planet, very mountainous, much climbing,
skill required.

The worst place is The Pit, try not to fall into it!

*> Head Over Heels Manual*
`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <h2>
        PENITENTIARY
      </h2>
      <h3>
        The empire's prison planet
      </h3>
      <p>
        <img
          src="texture-penitentiary.wall.skeleton.left"
        />
        Millions are imprisoned here. A harsh planet, very mountainous, much climbing,
    skill required.
      </p>
      <p>
        The worst place is The Pit, try not to fall into it!
      </p>
      <p>
        <em>
          &gt; Head Over Heels Manual
        </em>
         
      </p>
    </React.Fragment>
  `);
});

test("analogue control", () => {
  expect(
    parse(`**off**: walk in the original 4 directions: *⬅, ➡, ⬆, ⬇*.

controller/joystick with analogue sticks: ’on‘ to walk in any direction, not just along the two axes.

Or, with a keyboard/dpad, ’on‘ allows walking in eight directions. This makes some original rooms easier.`),
  ).toMatchInlineSnapshot(`
    <React.Fragment>
      <p>
        <strong>
          off
        </strong>
        : walk in the original 4 directions: 
        <em>
          ⬅, ➡, ⬆, ⬇
        </em>
        .
      </p>
      <p>
        controller/joystick with analogue sticks: ’on‘ to walk in any direction, not just along the two axes.
      </p>
      <p>
        Or, with a keyboard/dpad, ’on‘ allows walking in eight directions. This makes some original rooms easier.
      </p>
    </React.Fragment>
  `);
});

test("crashMessage", () => {
  expect(parse(`##The game crashed
If you want to help, please

* open an [issue on github](https://github.com/jimhigson/head-over-heels-online/issues)
* email to [jim@blockstack.ing](mailto:jim@blockstack.ing)

Include the information below, and a description of what you were doing`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <h2>
      The game crashed
    </h2>
    <p>
      If you want to help, please
    </p>
    <ul>
      <li>
        open an 
        <a
          href="https://github.com/jimhigson/head-over-heels-online/issues"
        >
          issue on github
        </a>
      </li>
      <li>
        email to 
        <a
          href="mailto:jim@blockstack.ing"
        >
          jim@blockstack.ing
        </a>
      </li>
    </ul>
    <p>
      Include the information below, and a description of what you were doing
    </p>
  </React.Fragment>
`);
});