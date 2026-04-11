import { OpenAPIHono } from '@hono/zod-openapi'
import type { AppEnv } from '../types'
import { authMiddleware } from '../middleware/auth'

import { userLoginRoute } from './user.route'
import { UserController } from '../controllers/user.controller'

import {
  listRecordsRoute,
  createRecordRoute,
  getRecordRoute,
  updateRecordRoute,
  deleteRecordRoute,
} from './records.route'
import { RecordController } from '../controllers/record.controller'

import {
  listPresetsRoute,
  listGroupsRoute,
  listGroupRecordsRoute,
} from './preset.route'
import { PresetController } from '../controllers/preset.controller'

import { getTagsRoute } from './tags.route'
import { TagController } from '../controllers/tag.controller'

import { reverseGeocodeRoute } from './location.route'
import { LocationController } from '../controllers/location.controller'

const router = new OpenAPIHono<AppEnv>()

// Public routes
router.openapi(userLoginRoute, UserController.login)

// Protected routes - records
router.use('/records', authMiddleware)
router.use('/records/*', authMiddleware)
router.openapi(listRecordsRoute, RecordController.list)
router.openapi(createRecordRoute, RecordController.create)
router.openapi(getRecordRoute, RecordController.getById)
router.openapi(updateRecordRoute, RecordController.update)
router.openapi(deleteRecordRoute, RecordController.remove)

// Protected routes - presets & groups
router.use('/presets', authMiddleware)
router.use('/groups', authMiddleware)
router.use('/groups/*', authMiddleware)
router.openapi(listPresetsRoute, PresetController.listPresets)
router.openapi(listGroupsRoute, PresetController.listGroups)
router.openapi(listGroupRecordsRoute, PresetController.listGroupRecords)

// Protected routes - tags
router.use('/tags', authMiddleware)
router.openapi(getTagsRoute, TagController.getSuggestions)

// Protected routes - location
router.use('/location/*', authMiddleware)
router.openapi(reverseGeocodeRoute, LocationController.reverseGeocode)

export default router
