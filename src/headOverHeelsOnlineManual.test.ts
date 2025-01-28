

import { expect, test } from "vitest";
import { parse } from './snarkdown-in-react';

// !!!!!!!!!!!!! examples from Head over Heels online, !!!!!!!!!!!!!!!
// see: https://blockstack.ing to play the game
// or: https://github.com/jimhigson/head-over-heels-online for the source code
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

test('blacktooth.md', () => {
    expect(parse(`## BLACKTOOTH

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

*> head over heels manual*`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <h2>
      BLACKTOOTH
    </h2>
    <div
      className="paragraph"
    >
      <img
        alt=""
        src="texture-blacktooth.wall.armour.left?bg-pureBlack"
      />
      <img
        alt=""
        src="texture-blacktooth.wall.shield.away?bg-pureBlack&float-right"
      />
      This planet has a large moon with three lunar space stations on it, the larger
  of these, 
      <em>
        Moon Station HQ
      </em>
      , is the main teleport center for the empire, with a
  direct teleport to all the slave planets.
    </div>
    <div
      className="paragraph"
    >
      Sometime after the Egyptus episode,
  the latest Emperor sent out a craft to find that same strange planet, and after
  much exploration, it was finally located, and the craft landed. However, the
  crew found the people had changed: instead of pyramids they used castles,
  instead of wrapping corpses up in cloth, they wrapped living men in metal and
  then tried to turn them into corpses with sharp metal sticks.
    </div>
    <div
      className="paragraph"
    >
      <img
        alt=""
        src="texture-teleporter"
      />
      The Emperor, not to be outdone by his ancestor, built a castle on Blacktooth and
  used it as his headquarters. The castle is surrounded by a small market, and
  then a range of impassable mountains. The only way to leave is via teleport to
  one of the three lunar space stations.
    </div>
    <div
      className="paragraph"
    >
      <em>
        &gt; head over heels manual
      </em>
    </div>
  </React.Fragment>
`);
});

test('crowns.md', () => {
    expect(parse(`## CROWNS

![](texture-crown.blacktooth)![](texture-crown.bookworld?float-right)![](texture-crown.egyptus?clear-left)![](texture-crown.penitentiary?float-right&clear-right)![](texture-crown.safari?clear-left)Find a crown and start a revolution. At the beginning of each game, a screen
showing all five planets with a crown above each will be displayed.

As each
crown is collected this screen will be shown again with the appropriate crowns
in a bright color.

*> head over heels manual*`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <h2>
      CROWNS
    </h2>
    <div
      className="paragraph"
    >
      <img
        alt=""
        src="texture-crown.blacktooth"
      />
      <img
        alt=""
        src="texture-crown.bookworld?float-right"
      />
      <img
        alt=""
        src="texture-crown.egyptus?clear-left"
      />
      <img
        alt=""
        src="texture-crown.penitentiary?float-right&clear-right"
      />
      <img
        alt=""
        src="texture-crown.safari?clear-left"
      />
      Find a crown and start a revolution. At the beginning of each game, a screen
  showing all five planets with a crown above each will be displayed.
    </div>
    <div
      className="paragraph"
    >
      As each
  crown is collected this screen will be shown again with the appropriate crowns
  in a bright color.
    </div>
    <div
      className="paragraph"
    >
      <em>
        &gt; head over heels manual
      </em>
    </div>
  </React.Fragment>
`);
});

test('cuddlyStuffedWhiteRabbits.md', () => {
    expect(parse(`## CUDDLY STUFFED WHITE RABBITS

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

*> Head Over Heels Manual*`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <h2>
      CUDDLY STUFFED WHITE RABBITS
    </h2>
    <div
      className="paragraph"
    >
      <img
        alt=""
        src="texture-bunny?float-right"
      />
      The 
      <em>
        cute toy bunnies
      </em>
       magically enhance your powers. The status display at the
  bottom of the screen will keep you informed as to which powers are temporarily
  enhanced.
    </div>
    <div
      className="paragraph"
    >
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
    </div>
    <div
      className="paragraph"
    >
      There are four types:
    </div>
    <ol>
      <li>
        <img
          alt=""
          src="texture-hud.char.2?sprite-tinted&text-metallicBlue"
        />
        <strong>
          Two extra lives
        </strong>
      </li>
      <li>
        <img
          alt=""
          src="texture-hud.shield?sprite-tinted&text-metallicBlue"
        />
        <strong>
          Iron Pills
        </strong>
         (to make you invulnerable)
      </li>
      <li>
        <img
          alt=""
          src="texture-hud.bigJumps?sprite-tinted&text-metallicBlue"
        />
        <strong>
          Jump higher bunny
        </strong>
         (only works on Heels)
      </li>
      <li>
        <img
          alt=""
          src="texture-hud.fastSteps?sprite-tinted&text-metallicBlue"
        />
        <strong>
          Go faster bunny
        </strong>
         (only works on slow-moving Head)
      </li>
    </ol>
    <div
      className="paragraph"
    >
      <em>
        &gt; Head Over Heels Manual
      </em>
    </div>
  </React.Fragment>
`);
});

test('swopKey.md', () => {
    expect(parse(`## SWOP KEY

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

*> head over heels manual*`)).toMatchInlineSnapshot(`
  <React.Fragment>
    <h2>
      SWOP KEY
    </h2>
    <div
      className="paragraph"
    >
      If Head is sitting on Heels, the swop key will, on each push, give you control
  of:
    </div>
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
    <div
      className="paragraph"
    >
      If Head is not on Heels, the swop key will, on each push, give you control of:
    </div>
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
    <div
      className="paragraph"
    >
      At all times, the character(s) whose icon is lit is under player control. When
  Head and Heels are joined together, all their abilities are combined.
    </div>
    <div
      className="paragraph"
    >
      <em>
        &gt; head over heels manual
      </em>
    </div>
  </React.Fragment>
`)
});