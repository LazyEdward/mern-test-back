// Copyright (c) 2025 LazyEdward
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import nodemailer from 'nodemailer';
import { EMAIL_AUTH_PASS, EMAIL_AUTH_USER, EMAIL_HOST, EMAIL_PORT, EMAIL_SENDER, EMAIL_SENDER_NAME } from '../constants/env';

class EmailService {
	private static instance: EmailService
	private transporter: nodemailer.Transporter

	constructor() {
		// send email using nodemailer, which is flexible in switching to other email hosting services
		// https://mailtrap.io/blog/expressjs-send-email/
		this.transporter = nodemailer.createTransport({
			host: EMAIL_HOST,
			port: Number(EMAIL_PORT),
			auth: {
				user: EMAIL_AUTH_USER,
				pass: EMAIL_AUTH_PASS
			}
		})
	}

	public static getInstance() {
		if (!EmailService.instance) {
			EmailService.instance = new EmailService()
		}

		return EmailService.instance
	}

	public async sendEmail(to: string, subject: string, html: string) {
		try {
			await this.transporter.sendMail({
				from: `${EMAIL_SENDER_NAME} <${EMAIL_SENDER}>`,
				to,
				subject,
				html
			})
		}
		catch (err) {
			console.error(err)
		}
	}

}

const getVerificationEmailTemplate = (title: string, verificationCode: string) => {
	return `
		<html lang="en-US">

		<head>
				<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
				<title>${title}</title>
				<meta name="description" content="Reset Password Email Template.">
				<style type="text/css">
						a:hover {text-decoration: underline !important;}
				</style>
		</head>

		<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
				<!--100% body table-->
				<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
								<td>
										<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
												align="center" cellpadding="0" cellspacing="0">
												<tr>
														<td style="height:80px;">&nbsp;</td>
												</tr>

												<tr>
														<td style="height:20px;">&nbsp;</td>
												</tr>
												<tr>
														<td>
																<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
																		style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
																		<tr>
																				<td style="height:40px;">&nbsp;</td>
																		</tr>
																		<tr>
																				<td style="padding:0 35px;">
																						<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">${title}</h1>
																						<span
																								style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
																						<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
																							Please copy the ${title} and paste it in the website.
																						</p>
																					<span
																								style="display:inline-block; vertical-align:middle; margin:10px; width:100px;"></span>
																						<p style="color:#455056; font-size:18px;line-height:24px; margin:0;"><b>
																								${verificationCode}
																							</b></p>

																				</td>
																		</tr>
																		<tr>
																				<td style="height:40px;">&nbsp;</td>
																		</tr>
																</table>
														</td>
												<tr>
														<td style="height:20px;">&nbsp;</td>
												</tr>

												<tr>
														<td style="height:80px;">&nbsp;</td>
												</tr>
										</table>
								</td>
						</tr>
				</table>
				<!--/100% body table-->
		</body>

		</html>
	`
}

export const sendVerificationEmail = async (email: string, verificationCode: string) => {
	console.log(`Verification code for ${email}: ${verificationCode}`)

	await EmailService.getInstance().sendEmail(
		email,
		'Verification code for User Account',
		getVerificationEmailTemplate('User Account Verification code', verificationCode)
	)

}

export const sendResetPasswordEmail = async (email: string, verificationCode: string) => {
	console.log(`Reset Password code for ${email}: ${verificationCode}`)

	await EmailService.getInstance().sendEmail(
		email,
		'Reset Password code for User Account',
		getVerificationEmailTemplate('Reset Password code', verificationCode)
	)

}
