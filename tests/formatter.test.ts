import Formatter from '../src/formatter'
import { Attachment, Attendee, Duration, Organizer, Relation, Trigger, XProp } from '../src/types/general'

let fmt: Formatter

describe('Test Formatter Class', () => {

	beforeAll(() => {
		fmt = new Formatter()
	})

	describe('Test simple properties', () => {
    
		it('Test format empty string', () => {
			const data = fmt.formatString('ATTRNAME')
			expect(data).toEqual('')
		})
    
		it('Test format string', () => {
			const data = fmt.formatString('ATTRNAME', 'string')
			expect(data).toEqual('ATTRNAME:string')
		})

		it('Format string with newlines', () => {
			const data = fmt.formatString('ATTRNAME', 'string \n with \n\n newlines')
			expect(data).toEqual('ATTRNAME:string \\n with \\n\\n newlines')
		})


		it('Format string with semicolon', () => {
			const data = fmt.formatString('ATTRNAME', 'string ; with semicolon')
			expect(data).toEqual('ATTRNAME:string \\; with semicolon')
		})
    
		it('Test format multiple empty strings', () => {
			const data = fmt.formatStrings('ATTRNAME', [])
			expect(data).toEqual('')
		})
    
		it('Test format multiple strings', () => {
			const data = fmt.formatStrings('ATTRNAME', [ 'string-one', 'string-two' ])
			expect(data).toEqual('ATTRNAME:string-one,string-two')
		})
    
		it('Test format number', () => {
			const data = fmt.formatString('ATTRNAME', 0)
			expect(data).toEqual('ATTRNAME:0')
		})
	})

	describe('Test date properties', () => {
    
		it('Test format simple date-time', () => {
			const data = fmt.formatDate('ATTRNAME', '20191106T160803Z')
			expect(data).toEqual('ATTRNAME:20191106T160803Z')
		})

		it('Test format complex date-time', () => {
			const data = fmt.formatDate('ATTRNAME', { value: '19971102T154000', tzId: 'Europe/Bratislava' })
			expect(data).toEqual('ATTRNAME;TZID=Europe/Bratislava:19971102T154000')
		})

		it('Test format complex date-time America/Los_Angeles', () => {
			const data = fmt.formatDate('ATTRNAME', { value: '20200217T025436', tzId: 'America/Los_Angeles' })
			expect(data).toEqual('ATTRNAME;TZID=America/Los_Angeles:20200217T025436')
		})

		// TODO: How to handle this?
		// it('Test format complex date', () => {
		// 	const data = fmt.formatDate('ATTRNAME', { value: '1997-11-02T22:54:36-08:00', type: 'DATE', tzId: 'Europe/Bratislava' })
		// 	expect(data).toEqual('ATTRNAME;VALUE=DATE;TZID=Europe/Bratislava:19971102')
		// })

		it('Test format complex date2', () => {
			const data = fmt.formatDate('ATTRNAME', { value: '19971102', type: 'DATE', tzId: 'Europe/Bratislava' })
			expect(data).toEqual('ATTRNAME;VALUE=DATE;TZID=Europe/Bratislava:19971102')
		})

		it('Test format simple recurring date-time', () => {
			const data = fmt.formatRDate({ dates: [ '20191106T160803Z' ] })
			expect(data).toEqual('RDATE:20191106T160803Z')
		})

		it('Test format multiple recurring date-times with timezone', () => {
			const data = fmt.formatRDate({ dates: [ '20191106T160803', '20181216T111823' ], tzId: 'Europe/Bratislava' })
			expect(data).toEqual('RDATE;TZID=Europe/Bratislava:20191106T160803,20181216T111823')
		})

		it('Test format simple recurring date', () => {
			const data = fmt.formatRDate({ type: 'DATE', dates: [ '19971102' ] })
			expect(data).toEqual('RDATE;VALUE=DATE:19971102')
		})

		it('Test format multiple recurring dates', () => {
			const data = fmt.formatRDate({ type: 'DATE', dates: [ '19971102', '19991222' ] })
			expect(data).toEqual('RDATE;VALUE=DATE:19971102,19991222')
		})

		it('Test format simple recurring period', () => {
			const data = fmt.formatRDate({
				type: 'PERIOD',
				periods: [ { start: '19960403T020000Z', end: '19960403T040000Z' } ]
			})
			expect(data).toEqual('RDATE;VALUE=PERIOD:19960403T020000Z/19960403T040000Z')
		})

		it('Test format multiple recurring periods with timezone', () => {
			const data = fmt.formatRDate({
				type: 'PERIOD',
				tzId: 'Europe/Bratislava',
				periods: [
					{ start: '19960403T020000', end: '19960403T040000' },
					{ start: '19960404T010000', duration: { hours: 3 } }
				]
			})
			expect(data).toEqual('RDATE;TZID=Europe/Bratislava;VALUE=PERIOD:19960403T020000/19960403T040000,1\r\n 9960404T010000/PT3H')
		})

		it('Test format duration', () => {
			const duration: Duration = {
				isNegative: true,
				hours: 5,
				minutes: 30
			}
			const data = fmt.formatDuration(duration)
			expect(data).toEqual('-PT5H30M')
		})

		it('Test format simple datetime trigger', () => {
			const trigger: Trigger = {
				value: '19980403T120000Z'
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER:19980403T120000Z')
		})

		it('Test format ISO (UTC time) datetime trigger', () => {
			const trigger: Trigger = {
				value: '20200205T090000Z'
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER:20200205T090000Z')
		})

		it('Test format ISO (UTC +2 time) datetime trigger', () => {
			const trigger: Trigger = {
				value: '20200205T070000Z'
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER:20200205T070000Z')
		})
    
		it('Test format simple duration trigger', () => {
			const trigger: Trigger = {
				value: {
					weeks: 2,
					days: 4
				}
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER:P2W4D')
		})
    
		it('Test format complex datetime trigger', () => {
			const trigger: Trigger = {
				related: 'START',
				value: '19980403T120000Z'
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER;RELATED=START:19980403T120000Z')
		})
    
		it('Test format complex duration trigger', () => {
			const trigger: Trigger = {
				related: 'START',
				value: {
					weeks: 2,
					days: 4
				}
			}
			const data = fmt.formatTrigger(trigger)
			expect(data).toEqual('TRIGGER;RELATED=START:P2W4D')
		})

	})

	describe('Test desciptive properties', () => {
    
		it('Test format geo position', () => {
			const data = fmt.formatGeo({ lat: 240, lon: 420 })
			expect(data).toEqual('GEO:240;420')
		})

		it('Test format attachment', () => {
			const attach: Attachment = {
				type: 'audio/basic',
				value: 'ftp://example.com/pub/'
			}
			const data = fmt.formatAttachment(attach)
			expect(data).toEqual('ATTACH;FMPTYPE=audio/basic:ftp://example.com/pub/')
		})
    
		it('Test format multiple attachments', () => {
			const attach: Attachment[] = [
				{
					value: 'http://example.com/public/quarterly-report.doc'
				},
				{
					type: 'application/msword',
					value: 'ftp://example.com/pub/docs/agenda.doc'
				}
			]
			const data = fmt.formatAttachments(attach)
			expect(data).toEqual('ATTACH:http://example.com/public/quarterly-report.doc\r\nATTACH;FMPTYPE=application/msword:ftp://example.com/pub/docs/agenda.doc')
		})

	})

	describe('Test relationship properties', () => {
        
		it('Test format simple organizer', () => {
			const organizer: Organizer = {
				address: 'jsmith@example.com'
			}
			const data = fmt.formatOrganizer(organizer)
			expect(data).toEqual('ORGANIZER:mailto:jsmith@example.com')
		})
    
		it('Test format complex organizer', () => {
			const organizer: Organizer = {
				address: 'jsmith@example.com',
				cn: 'JohnSmith',
				dir: 'ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)',
				sentBy: 'jane_doe@example.com'
			}
			const data = fmt.formatOrganizer(organizer)
			expect(data).toEqual('ORGANIZER;CN=JohnSmith;DIR="ldap://example.com:6666/o=DC%20Associates,c=US?\r\n ??(cn=John%20Smith)";SENT-BY="mailto:jane_doe@example.com":mailto:jsmith@ex\r\n ample.com')
		})
    
		it('Test format simple attendee', () => {
			const attendee: Attendee = {
				address: 'john_public@example.com'
			}
			const data = fmt.formatAttendee(attendee)
			expect(data).toEqual('ATTENDEE:mailto:john_public@example.com')
		})
    
		it('Test format complex attendee', () => {
			const attendee: Attendee = {
				address: 'john_public@example.com',
				cn : 'Henry Cabot',
				dir : '',
				sentBy : '',
				cu: 'GROUP',
				member: [ 'projectA@example.com', 'projectB@example.com' ],
				role: 'REQ-PARTICIPANT',
				partstat: 'ACCEPTED',
				rsvp: true,
				delegatedTo: [ 'jdoe@example.com', 'jqpublic@example.com' ],
				delegatedFrom: [ 'jsmith@example.com' ]
			}
			const data = fmt.formatAttendee(attendee)
			expect(data).toEqual('ATTENDEE;CN=Henry Cabot;CUTYPE=GROUP;MEMBER="mailto:projectA@example.com","\r\n mailto:projectB@example.com";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=tr\r\n ue;DELEGATED-TO="mailto:jdoe@example.com","mailto:jqpublic@example.com";DEL\r\n EGATED-FROM="mailto:jsmith@example.com":mailto:john_public@example.com')
		})
    
		it('Test format multiple simple attendees', () => {
			const attendees: Attendee[] = [
				{
					address: 'john_public@example.com'
				},
				{
					address: 'joecool@example.com'
				}
			]
			const data = fmt.formatAttendees(attendees)
			expect(data).toEqual('ATTENDEE:mailto:john_public@example.com\r\nATTENDEE:mailto:joecool@example.com')
		})
    
		it('Test format simple relation', () => {
			const relation: Relation = {
				value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
			}
			const data = fmt.formatRelation(relation)
			expect(data).toEqual('RELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com')
		})
    
		it('Test format complex relation', () => {
			const relation: Relation = {
				type: 'SIBLING',
				value: '19960401-080045-4000F192713@example.com'
			}
			const data = fmt.formatRelation(relation)
			expect(data).toEqual('RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com')
		})
    
		it('Test format multiple relations', () => {
			const relations: Relation[] = [
				{
					type: 'SIBLING',
					value: '19960401-080045-4000F192713@example.com'
				},
				{
					value: 'jsmith.part7.19960817T083000.xyzMail@example.com'
				}
			]
			const data = fmt.formatRelations(relations)
			expect(data).toEqual('RELATED-TO;RELTYPE=SIBLING:19960401-080045-4000F192713@example.com\r\nRELATED-TO:jsmith.part7.19960817T083000.xyzMail@example.com')
		})

	})

	describe('Test non-standard properties', () => {
        
    
		it('Test format xProp', () => {
			const xProp: XProp = {
				name: 'IKALENDAR-PROP',
				value: 'Matej Vilk'
			}
			const data = fmt.formatXProp(xProp)
			expect(data).toEqual('X-IKALENDAR-PROP:Matej Vilk')
		})
    
		it('Test format multiple xProps', () => {
			const xProps: XProp[] = [
				{
					name: 'IKALENDAR-PROP1',
					value: 'Matej Vilk'
				},
				{
					name: 'IKALENDAR-PROP2',
					value: 'Matej Vilk'
				}
			]
			const data = fmt.formatXProps(xProps)
			expect(data).toEqual(
				'X-IKALENDAR-PROP1:Matej Vilk\r\nX-IKALENDAR-PROP2:Matej Vilk'
			)
		})
	})
})
